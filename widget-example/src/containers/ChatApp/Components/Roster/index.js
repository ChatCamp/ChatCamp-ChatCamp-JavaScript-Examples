import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from 'state/groupChannelsState/actions'
import {List, Label, Icon, Image } from 'semantic-ui-react'
import AvatarWrapper from 'containers/ChatApp/Components/AvatarWrapper'
import status from 'utility/status'
import UtilityTime from 'utility/UtilityTime'
import client from 'Client'



// import './style.css'

class Roster extends Component {

  ifPopUp = () => {
    if (this.props.smartChat.get("type") === "popup" || this.props.smartChat.get("type") === "inbox"){
      return true
    }
    else{
      return false
    }
  }

  ifP2P = (id) => {
    if(this.props.groupChannels.getIn([id, 'participantsCount'], "0") === 2 && this.props.groupChannels.getIn([id, 'isDistinct'], false) === true){
      return true
    }
    else{
      return false
    }
  }

  p2pOtherParticipant = (gid) => {
    let id = this.props.user.get("id")
    let participants = this.props.groupChannels.getIn([gid, 'participants'])
    console.log(participants)
    for(let i in participants){
      if(participants[i].id !== id){
          return participants[i]
      }
    }
  }

  onInboxClick = (id) => {
    let currentId =  this.props.groupChannelsState.keySeq().toArray()[0]
    if(id !== currentId){
      window.ChatCampUI.startChat(id)
      // this.props.actions.groupChannelsClose(currentId)
    }
  }

  onUserClick = (id) => {
    let currentId =  this.props.groupChannelsState.keySeq().toArray()[0]
    // let that = this
    client.GroupChannel.create("New Group", [id, this.props.user.get("id")], true ,function(error, newGroupChannel) {
      if(newGroupChannel.id !== currentId){
        window.ChatCampUI.startChat(newGroupChannel.id)
        // that.props.actions.groupChannelsClose(currentId)
      }
    })

  }

  render () {
    let sourceURL = "http://localhost:3000/"
    let source_online =  sourceURL + "icons8-connection-status-on-96.png"
    let source_offline =  sourceURL + "icons8-connection-status-off-96.png"
    let roster = []
    let inlineStyleDisplay ={
      display: "table-cell"
    }
    let inlineStyleHeight ={
      lineHeight: "36px"
    }
    let inlineStyleHeightImage ={
      lineHeight: "36px",
      height: "36px",
      position: "relative",
      marginTop: '13px'
    }
    let getStatusStyle = (statusCode) => {
      return {
        top: "-25px",
        left: "43px",
        position: "relative",
        border: "1px solid",
        borderColor: "#fff",
        backgroundColor: status.getColorFromStatusCode(statusCode)
      }
    }
    //iterating in roster and rendering active users
    if(this.props.type === "users"){
      this.props.userList.map((rosterItem) => {
        if(rosterItem.getIn(['id']) !== this.props.user.getIn(['id'])){
          let onlineStatus
          if(rosterItem.getIn(['isOnline'])){
            onlineStatus = <Image className= "cc-user-list-status" src={source_online} />
          }
          else {
            onlineStatus = <Image className= "cc-user-list-status" src={source_offline} />
          }
          roster.push(
            <List.Item key={"roster-key-" + rosterItem.getIn(['id']) } onClick={() => this.onUserClick(rosterItem.getIn(['id']))}>

              {/* <List.Content style={inlineStyleHeight} floated='right' verticalAlign='middle'>
                <Icon name='ellipsis vertical' />
              </List.Content> */}

              {/* <Image as={()=> <AvatarWrapper style={inlineStyleDisplay} className="image" name={rosterItem.userName} />} /> */}
              <List.Content style={inlineStyleHeightImage} floated='left' verticalAlign='middle'>
                <Image as={()=> <AvatarWrapper style={inlineStyleDisplay} className="image" name={rosterItem.getIn(['displayName'])} />}/>
                {/* <Icon name="circle"/> */}
                {onlineStatus}
                {/* <Label style={getStatusStyle('A')} circular floating empty /> */}
              </List.Content>

              <List.Content className="cc-user-list-name" style={inlineStyleHeight} verticalAlign='middle'>
                <List.Header>{rosterItem.getIn(['displayName'])}</List.Header>
              </List.Content>

             </List.Item>
          )
        }
      })
    }
    //
    // if(this.props.type === "rooms"){
    //   for(let i in this.props.rooms){
    //     roster.push(
    //       <List.Item key={"roster-key-" + this.props.rooms[i].id } onClick={() => this.props.onRoomClick(this.props.rooms[i].id)}>
    //
    //         <List.Content style={inlineStyleHeight} floated='right' verticalAlign='middle'>
    //           <Icon name='ellipsis vertical' />
    //         </List.Content>
    //
    //         <List.Content style={inlineStyleHeightImage} floated='left' verticalAlign='middle'>
    //           <Image as={()=> <AvatarWrapper style={inlineStyleDisplay} className="image" name={"#"} />}/>
    //           {/* <Icon name="circle"/> */}
    //           {/* <Label style={inlineStyleHeightStatus} circular floating color={"red"} empty /> */}
    //         </List.Content>
    //
    //         <List.Content style={inlineStyleHeight} verticalAlign='middle'>
    //           <List.Header>{this.props.rooms[i].name}</List.Header>
    //         </List.Content>
    //
    //        </List.Item>
    //     )
    //   }
    // }
    let inboxValues = this.props.groupChannelsList.toArray()
    if(this.props.type === "inbox" && inboxValues){
      for(let i in inboxValues){
        let topClass = "list-inbox"
        let id = inboxValues[i]
        // let openChannelId = this.props.groupChannelsState.keySeq().toArray()[0]
        // if(id === openChannelId){
        //   topClass = "list-inbox list-item-selected"
        // }
        let rosterItem
        if(this.props.groupChannels){
          rosterItem = this.props.groupChannels.getIn([id])
        }
        //TODO: break this into separate function
        //TODO: Get user from local user db rather than online user list
        let user = {}
        user.name = "Name"
        user.status = "A"
        let groupChannelName
        if(rosterItem){
          groupChannelName = rosterItem.getIn(['name'])


        console.log("id", id)
        if(id && this.ifPopUp() && this.ifP2P(id)){
          let other = this.p2pOtherParticipant(id)
          console.log(other)
          if(other){
            groupChannelName = other.displayName
          }
        }

        //   })

        roster.push(
          // <List.Item className={"list-inbox"} key={"roster-key-" + rosterItem.id } onClick={() => this.props.onUserClick(user.id)}>
          <List.Item className={topClass} key={"roster-key-" + rosterItem.getIn(['id']) } onClick={() => this.onInboxClick(rosterItem.getIn(['id']))}>

            <List.Content className={"list-item-time"} style={inlineStyleHeight} floated='right' verticalAlign='middle'>
              {/* <Icon name='ellipsis vertical' /> */}
              {(rosterItem.getIn(['lastMessage']))? UtilityTime.getTime('3', rosterItem.getIn(['lastMessage']).insertedAt*1000) : ""}
            </List.Content>

            <List.Content style={inlineStyleHeightImage} floated='left' verticalAlign='middle'>
              <Image as={()=> <AvatarWrapper style={inlineStyleDisplay} className="image" name={rosterItem.getIn(['name'])} />}/>
              {/* <Label style={getStatusStyle(user.status)} circular floating empty /> */}
            </List.Content>

            <List.Content style={inlineStyleHeight} verticalAlign='middle'>
              <List.Header className={"list-inbox-header"}>{groupChannelName}</List.Header>
              <List.Description className={"list-inbox-description"}>{(rosterItem.getIn(['lastMessage'])? rosterItem.getIn(['lastMessage']).user.displayName + " : " + rosterItem.getIn(['lastMessage']).text : "")}</List.Description>
            </List.Content>

           </List.Item>
        )
      }
      }
    }

    return (
      <List selection verticalAlign='middle' relaxed="very" size="medium">
        {roster}
      </List>
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

export default connect(mapStateToProps, mapDispatchToProps)(Roster)
