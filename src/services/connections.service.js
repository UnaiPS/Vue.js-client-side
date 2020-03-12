import axios from 'axios';

const API_URL = 'http://localhost:8069/connections/';

class ConnectionService{
    createConnection(transaction){
        return axios.post(API_URL,JSON.stringify(transaction),
        {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    updateConnection(connectionId, transaction){
        return axios.put(API_URL + connectionId, JSON.stringify(transaction),
        {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    deleteConnection(connectionId){
        return axios.delete(API_URL + connectionId,
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    findAllConnections(){
        return axios.get(API_URL,
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    findConnection(connectionId){
        return axios.get(API_URL + connectionId,
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }
}
export default new ConnectionService();