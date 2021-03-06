/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

import { describe, it, before } from 'mocha'
import { spy } from 'sinon'
import { configure, ready, plan, BaseAe, networkId } from './'
import { generateKeyPair } from '../../es/utils/crypto'
import Channel from '../../es/channel'

const wsUrl = process.env.WS_URL || 'ws://node:3014'

plan('10000000000000000')

function waitForChannel (channel) {
  return new Promise(resolve =>
    channel.on('statusChanged', (status) => {
      if (status === 'open') {
        resolve()
      }
    })
  )
}

describe('Channel', function () {
  configure(this)
  this.retries(3)

  let initiator
  let responder
  let initiatorCh
  let responderCh
  let responderShouldRejectUpdate
  let existingChannelId
  let offchainTx
  const responderSign = async (tag, tx) => {
    if (!responderShouldRejectUpdate) {
      return await responder.signTransaction(tx)
    }
    return null
  }
  const sharedParams = {
    url: wsUrl,
    pushAmount: 3,
    initiatorAmount: 1000000000000000,
    responderAmount: 1000000000000000,
    channelReserve: 20000000000,
    ttl: 10000,
    host: 'localhost',
    port: 3001,
    lockPeriod: 10
  }

  before(async function () {
    initiator = await ready(this)
    responder = await BaseAe({ nativeMode: true, networkId })
    responder.setKeypair(generateKeyPair())
    sharedParams.initiatorId = await initiator.address()
    sharedParams.responderId = await responder.address()
    await initiator.spend('2000000000000000', await responder.address())
  })

  beforeEach(() => {
    responderShouldRejectUpdate = false
  })

  it('can open a channel', async () => {
    initiatorCh = await Channel({
      ...sharedParams,
      role: 'initiator',
      sign: async (tag, tx) => await initiator.signTransaction(tx)
    })
    responderCh = await Channel({
      ...sharedParams,
      role: 'responder',
      sign: responderSign
    })
    return Promise.all([waitForChannel(initiatorCh), waitForChannel(responderCh)])
  })

  it('can post update and accept', async () => {
    responderShouldRejectUpdate = false
    const result = await initiatorCh.update(
      await initiator.address(),
      await responder.address(),
      1,
      async (tx) => await initiator.signTransaction(tx)
    )
    result.accepted.should.equal(true)
    result.state.should.be.a('string')
  })

  it('can post update and reject', async () => {
    responderShouldRejectUpdate = true
    const result = await initiatorCh.update(
      await responder.address(),
      await initiator.address(),
      1,
      async (tx) => await initiator.signTransaction(tx)
    )
    result.accepted.should.equal(false)
  })

  it('can get proof of inclusion', async () => {
    const initiatorAddr = await initiator.address()
    const responderAddr = await responder.address()
    const params = { accounts: [initiatorAddr, responderAddr] }
    const initiatorPoi = await initiatorCh.poi(params)
    const responderPoi = await responderCh.poi(params)
    initiatorPoi.should.be.a('string')
    responderPoi.should.be.a('string')
  })

  it('can get balances', async () => {
    const initiatorAddr = await initiator.address()
    const responderAddr = await responder.address()
    const addresses = [initiatorAddr, responderAddr]
    const initiatorBalances = await initiatorCh.balances(addresses)
    const responderBalances = await responderCh.balances(addresses)
    initiatorBalances.should.be.an('object')
    responderBalances.should.be.an('object')
    initiatorBalances[initiatorAddr].should.be.a('number')
    initiatorBalances[responderAddr].should.be.a('number')
    responderBalances[initiatorAddr].should.be.a('number')
    responderBalances[responderAddr].should.be.a('number')
  })

  it('can send a message', async () => {
    const sender = await initiator.address()
    const recipient = await responder.address()
    const info = 'hello world'
    initiatorCh.sendMessage(info, recipient)
    const message = await new Promise(resolve => responderCh.on('message', resolve))
    message.should.eql({
      // TODO: don't ignore `channel_id` equality check
      channel_id: message.channel_id,
      from: sender,
      to: recipient,
      info
    })
  })

  it('can request a withdraw and accept', async () => {
    const onOnChainTx = spy()
    const onOwnWithdrawLocked = spy()
    const onWithdrawLocked = spy()
    responderShouldRejectUpdate = false
    const result = await initiatorCh.withdraw(
      2,
      async (tx) => initiator.signTransaction(tx),
      { onOnChainTx, onOwnWithdrawLocked, onWithdrawLocked }
    )
    result.should.eql({ accepted: true, state: initiatorCh.state() })
    onOnChainTx.callCount.should.equal(1)
    onOnChainTx.getCall(0).args[0].should.be.a('string')
    onOwnWithdrawLocked.callCount.should.equal(1)
    onWithdrawLocked.callCount.should.equal(1)
  })

  it('can request a withdraw and reject', async () => {
    const onOnChainTx = spy()
    const onOwnWithdrawLocked = spy()
    const onWithdrawLocked = spy()
    responderShouldRejectUpdate = true
    const result = await initiatorCh.withdraw(
      2,
      async (tx) => initiator.signTransaction(tx),
      { onOnChainTx, onOwnWithdrawLocked, onWithdrawLocked }
    )
    result.should.eql({ accepted: false })
    onOnChainTx.callCount.should.equal(0)
    onOwnWithdrawLocked.callCount.should.equal(0)
    onWithdrawLocked.callCount.should.equal(0)
  })

  it('can request a deposit and accept', async () => {
    const onOnChainTx = spy()
    const onOwnDepositLocked = spy()
    const onDepositLocked = spy()
    responderShouldRejectUpdate = false
    const result = await initiatorCh.deposit(
      2,
      async (tx) => initiator.signTransaction(tx),
      { onOnChainTx, onOwnDepositLocked, onDepositLocked }
    )
    result.should.eql({ accepted: true, state: initiatorCh.state() })
    onOnChainTx.callCount.should.equal(1)
    onOnChainTx.getCall(0).args[0].should.be.a('string')
    onOwnDepositLocked.callCount.should.equal(1)
    onDepositLocked.callCount.should.equal(1)
  })

  it('can request a deposit and reject', async () => {
    const onOnChainTx = spy()
    const onOwnDepositLocked = spy()
    const onDepositLocked = spy()
    responderShouldRejectUpdate = true
    const result = await initiatorCh.deposit(
      2,
      async (tx) => initiator.signTransaction(tx),
      { onOnChainTx, onOwnDepositLocked, onDepositLocked }
    )
    result.should.eql({ accepted: false })
    onOnChainTx.callCount.should.equal(0)
    onOwnDepositLocked.callCount.should.equal(0)
    onDepositLocked.callCount.should.equal(0)
  })

  it('can close a channel', async () => {
    const tx = await initiatorCh.shutdown(async (tx) => await initiator.signTransaction(tx))
    tx.should.be.a('string')
  })

  it('can leave a channel', async () => {
    initiatorCh = await Channel({
      ...sharedParams,
      role: 'initiator',
      sign: async (tag, tx) => await initiator.signTransaction(tx)
    })
    responderCh = await Channel({
      ...sharedParams,
      role: 'responder',
      sign: responderSign
    })
    await Promise.all([waitForChannel(initiatorCh), waitForChannel(responderCh)])
    const result = await initiatorCh.leave()
    result.channelId.should.be.a('string')
    result.state.should.be.a('string')
    existingChannelId = result.channelId
    offchainTx = result.state
  })

  it('can reestablish a channel', async () => {
    initiatorCh = await Channel({
      ...sharedParams,
      role: 'initiator',
      existingChannelId,
      offchainTx,
      sign: async (tag, tx) => await initiator.signTransaction(tx)
    })
    responderCh = await Channel({
      ...sharedParams,
      role: 'responder',
      existingChannelId,
      offchainTx,
      sign: async (tag, tx) => await responder.signTransaction(tx)
    })
    await Promise.all([waitForChannel(initiatorCh), waitForChannel(responderCh)])
  })
})
