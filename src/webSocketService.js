class WebSocketService {
    constructor(url) {
      this.socket = new WebSocket(url);
      this.socket.addEventListener('open', this.handleOpen);
      this.socket.addEventListener('message', this.handleMessage);
      this.socket.addEventListener('error', this.handleError);
      this.socket.addEventListener('close', this.handleClose);
    }
  
    handleOpen = () => {
      console.log('WebSocket connection established');
    };
  
    handleMessage = (event) => {
      console.log('Received message:', event.data);
      let data = JSON.parse(event.data)
      console.log("id: "+data.id)
     if(data.id?.startsWith("\"balance")){
      console.log("user balance of "+data.id.substring(7,)+" is: "+data.result.balance)
     }
    };
  
    handleError = (error) => {
      console.error('WebSocket error:', error);
    };
  
    handleClose = (event) => {
      console.log('WebSocket connection closed with code:', event.code);
    };
  
    sendPayload = (payload) => {
      this.socket.send(JSON.stringify(payload));
    };
  
    closeConnection = () => {
      this.socket.close();
    };

    getState = () => {
      const status = this.socket.readyState
      console.log("websocket status: ",status)
      return status
    }
  }
  
  export default WebSocketService;