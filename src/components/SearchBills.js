import React, { Component, Fragment } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Bill from './Bill'
import { FormControl, Button, InputGroup, Table} from 'react-bootstrap'

const BILL_SEARCH_QUERY = gql`
  query BillSearchQuery($filter: String!) {
    searchBills(filter: $filter) {
      bills {
        id
        vendor
        date
        account
        amount
      }
    }
  }
`
const containerStyle = {
  marginTop: '10%',
  // backgroundColor: '#DDFFFC',
  // padding: '0 20% 0 20%'
};

const titleStyle = {
  marginTop: '3%',
  padding: '0 20% 0 20%',
  // backgroundColor: '#FDFFCC',
  // padding: '20% 20% 20% 20%',
};

const searchStyle = {
  marginTop: '3%',
  // backgroundColor: '#FDFFDD',
  padding: '0 20% 5% 20%'
};

class SearchBills extends Component {
  state = {
    bills: [],
    filter: '',
  }

  render() {
    return (
      <div className="container" style={containerStyle}>
        {/* <h2 style={titleStyle}>Search Payable</h2>
        <Form inline style={searchStyle}>
          <FormControl type="text" placeholder="Search" className="mr-sm-2"   onChange={e => this.setState({ filter: e.target.value })}/>
          <Button variant="outline-primary" onClick={() => this._executeSearch()}>Search</Button>
        </Form>
        {this.state.bills.map((bill, index) => (
          <Bill key={bill.id} bill={bill} index={index} />
        ))} */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search Payable"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <InputGroup.Append>
            <Button variant="outline-primary" onClick={() => this._executeSearch()} >Search</Button>
          </InputGroup.Append>
        </InputGroup>
        <Table striped hover size="sm" >
          <thead >
            <tr>
              <th>Date</th>
              <th>Vendor Name</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          {this.state.bills.map((bill, index) => (
            // <Bill key={bill.id} bill={bill} index={index}/>
            <Fragment key={bill.id} bill={bill} index={index}>
              <tbody>
                <tr>
                  <td>{bill.date}</td>
                  <td>{bill.vendor}</td>
                  <td>{bill.account}</td>
                  <td>{bill.amount}</td>
                  <td> Open</td>
                </tr>
              </tbody>
            </Fragment>
          ))}
        </Table>
      </div>
    )
  }


  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: BILL_SEARCH_QUERY,
      variables: { filter },
    })
    const bills = result.data.searchBills.bills
    this.setState({ bills })
  }
}

export default withApollo(SearchBills)
