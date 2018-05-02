import {combineReducers} from 'redux'

import {auth} from 'state/auth/reducer'

import {app} from 'state/app/reducer'
import {groupChannels} from 'state/groupChannels/reducer'
import {openChannels} from 'state/openChannels/reducer'



import {login} from 'state/login/reducer'

import {messages} from 'state/messages/reducer'

import {onlineUsers} from 'state/onlineUsers/reducer'


import {smartChat} from 'state/smartChat/reducer'
import {groupChannelsState} from 'state/groupChannelsState/reducer'
import {openChannelsState} from 'state/openChannelsState/reducer'
import {groupChannelsList} from 'state/groupChannelsList/reducer'
import {user} from 'state/user/reducer'
import {userList} from 'state/userList/reducer'


export const rootReducer = combineReducers({
  auth,
  app,
  groupChannels,
  openChannels,
  login,
  messages,
  onlineUsers,
  smartChat,
  groupChannelsState,
  openChannelsState,
  groupChannelsList,
  user,
  userList
})
