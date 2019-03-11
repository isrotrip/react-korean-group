import React from 'react'
import App from './../App'
import { render, wait, fireEvent} from 'react-testing-library'
import {MemoryRouter as Router} from 'react-router-dom'
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import {fetchMember} from './../api/api'

jest.mock('./../api/api.js', () => {
  return {
    fetchMember: jest.fn(() => {
      console.log('aku dipanggil ')
      return new Promise(resolve => {
        resolve({
          members: Array.from({length: 7}, () => ({})),
          groupName: 'bts'
        })
      })
    })
  }
})

test('it will navigate to /find-group when find group link is clicked', () => {
  const {container, getByText, debug, getByTestId, queryByTestId} = render(
    <Router initialEntries={['/']}>
      <App />
    </Router>
  )
  expect(getByTestId('home-page')).toBeInTheDocument()
  const findGroup = getByText('Find Group')
  fireEvent.click(findGroup)
  expect(getByTestId('find-group-page')).toBeInTheDocument()
  expect(queryByTestId('home-page')).not.toBeInTheDocument()

  const groupInput = getByTestId('group-name')
  
  fireEvent.change(groupInput, {
    target: {
      value: 'bts'
    }
  })

  const formSearch = getByTestId('submit-search')
  fireEvent.submit(formSearch)

  return wait(() => expect(getByText('Members of bts')).toBeInTheDocument())
    .then(() => {
      const memberWrapper = getByTestId('member-wrapper')
      expect(memberWrapper.childElementCount).toBe(7)

      expect(fetchMember).toHaveBeenCalledTimes(1)
      expect(fetchMember).toHaveBeenCalledWith('bts')
    })

})