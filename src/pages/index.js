import React from 'react'
import Link from 'gatsby-link'
import axios from 'axios'

const countArbitProfit = async (via, reverse = false) => {
  const idrPerBtc = await axios
    .get(`https://vip.bitcoin.co.id/api/btc_idr/ticker`)
    .then(({ data }) => data.ticker.last)
  const btcPerVia = await axios
    .get(`https://vip.bitcoin.co.id/api/${via}_btc/ticker`)
    .then(({ data }) => data.ticker.last)
  const idrPerVia = await axios
    .get(`https://vip.bitcoin.co.id/api/${via}_idr/ticker`)
    .then(({ data }) => data.ticker.last)

  const calcProfitRev = (idrPerBtc - idrPerVia / btcPerVia) / idrPerBtc

  const calcProfit = (idrPerVia - idrPerBtc * btcPerVia) / idrPerVia

  console.log(`${via}`, {
    idrPerBtc,
    btcPerVia,
    idrPerVia,
    calcProfit,
    calcProfitRev
  })

  return { idrPerBtc, btcPerVia, idrPerVia, calcProfit, calcProfitRev }
}

const vias = ['eth', 'ltc', 'nxt', 'xrp']

class ArbitItem extends React.Component {
  componentDidMount() {
    console.log(this.props.via)
    countArbitProfit(this.props.via).then(result => {
      this.setState({ result })
    })
  }

  render() {
    return this.state && this.state.result ? (
      <div>
        <h4>IDR -> BTC -> {this.props.via.toUpperCase()} -> IDR</h4>
        <p>Profit: {this.state.result.calcProfit * 100}%</p>
        <h4>IDR -> {this.props.via.toUpperCase()} -> BTC -> IDR</h4>
        <p>Profit: {this.state.result.calcProfitRev * 100}%</p>
      </div>
    ) : (
      <div>
        <p>Loading...</p>
      </div>
    )
  }
}

class IndexPage extends React.Component {
  render = () => <div>{vias.map(item => <ArbitItem via={item} />)}</div>
}

export default IndexPage
