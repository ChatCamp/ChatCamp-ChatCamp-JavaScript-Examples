import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from 'state/groupChannels/actions'
import client from 'Client'
import Utility from 'utility/Utility'


class SoundNotification extends Component {
  state = {
    groupChannelId: ''
  }

  componentDidMount(){
    let {groupChannelId, user} =  this.props
    let channelListener = new client.ChannelListener();
    channelListener.onGroupChannelMessageReceived = function(groupChannel, message) {
      if(groupChannelId === groupChannel.id){
        if(user.get("id") !== message.user.id){
          Utility.playSound("1");
        }
      }
    }
    client.addChannelListener("SoundNotification", channelListener)
  }

  render() {

    return (
      null
    )
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch) //binds all the actions with dispatcher and returns them
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SoundNotification)
