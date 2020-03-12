import axios from 'axios'

const API_URL = 'http://localhost:8069/types/';

class TypeService{
    createType(transaction){
        return axios.post(API_URL, JSON.stringify(transaction),
        {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    updateType(typeId, transaction){
        return axios.put(API_URL + typeId, JSON.stringify(transaction),
        {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    findAllTypes(){
        return axios.get(API_URL,
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    findType(typeId){
        return axios.get(API_URL + typeId,
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }
}
export default new TypeService();