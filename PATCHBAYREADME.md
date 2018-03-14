RTC Patch Bay

Module built on top of SimplePeer to handle ad-hoc connections with multiple peers. Uses a signaling server (patch-bay-server) to define a "room" or "channel" for connecting. Peers in the same room can choose to connect to all other peers in the same room (i.e. in a conference call), or can create and remove peer connections as needed.

Messages to other peers are sent via data channels when possible, or via websockets when a connection between to peers has not yet been established.


Options:

id: unique id for this user (if not supplied, will be generated)

peerOptions: default connection options to be sent to SimplePeer

room: room or channel name

stream: stream to share with peers


Methods:

ob.sendToAll(data)

Sends to all peers connected via WebRTC (NOT to all in room. See pb.broadcast())
