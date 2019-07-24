import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import ReduxThunk from 'redux-thunk';
import { Card, Table, Spin } from 'antd';
import { connect, Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware, compose} from 'redux';

const RETRIEVE_USERS_START = 'RETRIEVE_USERS_START'
const retrieveUsersStart = () => ({
    type: RETRIEVE_USERS_START,
})

const retrieveUsers = () => dispatch => {
    dispatch(retrieveUsersStart())
    axios.get("https://randomuser.me/api/?results=50")
        .then(response => dispatch(retrieveUsersSucceed(response.data.results.map(item => ({ ...item, key: item.login.uuid })))))
        .catch(e => dispatch(retrieveUsersFailed()))
}

const RETRIEVE_USERS_SUCCEED = 'RETRIEVE_USERS_SUCCEED'
const retrieveUsersSucceed = items => ({
    type: RETRIEVE_USERS_SUCCEED,
    items
})

const RETRIEVE_USERS_FAILED = 'RETRIEVE_USERS_FAILED'
const retrieveUsersFailed = () => ({
    type: RETRIEVE_USERS_FAILED,
})

const defaultState = {
    items: [],
    loading: false,
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case RETRIEVE_USERS_START:
            return { ...state, loading: true }
        case RETRIEVE_USERS_SUCCEED:
            return { ...state, items: action.items, loading: false }
        case RETRIEVE_USERS_FAILED:
            return { ...state, loading: false }
        default:
            return state
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(ReduxThunk)
));

const App = ({ loading, items, retrieveUsers }) => {
    React.useEffect(() => retrieveUsers(), [retrieveUsersSucceed])

    const columns = [{
        title: 'First Name',
        dataIndex: 'name.first',
    }, {
        title: 'Last Name',
        dataIndex: 'name.last',
    }]

    return (
        <Card title="Users">
            {loading ? <Spin /> : <Table dataSource={items} columns={columns} loading={loading} />}
        </Card>
    )
}

const mSTP = ({ items, loading }) => ({
    items,
    loading
})

const mDTP = dispatch => ({
    retrieveUsers: items => dispatch(retrieveUsers())
})

const ConnectedApp = connect(mSTP, mDTP)(App)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp/>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
