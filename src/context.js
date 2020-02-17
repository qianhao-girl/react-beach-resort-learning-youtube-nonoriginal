import React,{ Component } from 'react';
// import items from './data';

import ContentfulClient from "./Contentful";

const RoomContext = React.createContext();
//<RoomConext.Provider value={}
class RoomProvider extends Component{
    state={
        rooms:[],
        sortedRooms:[],
        featureRooms:[],
        loading: true, 
        type:'all',
        capacity:0,
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        breakfast: false,
        pets: false,      
    }
// getData{}
    
    getData = async () =>{
        try{
            let rooms;
            let featureRooms;
            let maxPrice;
            let maxSize;
            let _responseHandler = (response) =>{
                console.log(response)
                rooms = this.formatData(response.items);
                featureRooms = rooms.filter(room => room.featured === true);
                maxPrice = Math.max(...rooms.map(item=>item.price));
                maxSize = Math.max(...rooms.map(item=>item.size));
                this.setState({
                    rooms: rooms,
                    featureRooms,
                    sortedRooms: rooms,
                    loading: false,
                    price: maxPrice,
                    maxPrice: maxPrice,
                    maxSize: maxSize,            
                });
            }

            await ContentfulClient
                .getEntries({content_type: "beachResortRooms",order: 'sys.createdAt'})
                .then(_responseHandler);        
        }catch(error){
            console.log(error);
        }
}


    componentDidMount(){
        this.getData();        
    }

    formatData(items){
        let tmpItems = items.map(item=>{
            console.log(item.fields.images,item.fields['name']);
            let id = item.sys.id
            let images = item.fields.images.map(image => 
                image.fields.file.url);

            let room = { ...item.fields, images:images, id }
            return room;
        })

        return tmpItems;
    }

    getRoom = (slug) =>{
        let tmpRooms = [...this.state.rooms];
        let room = tmpRooms.find((room) => room.slug===slug);
        return room;
    }

    handleChange = event =>{
        const target = event.target;
        const value = target.type ==="checkbox"? target.checked: target.value;
        const name = target.name;
        console.log(`this is name ${name},
         this is value ${value}`);
        //[name]??
        this.setState(
            {
              [name]: value,
            },
            this.filterRooms
        );
    }

    filterRooms = () => {
        let{
            rooms,
            type, 
            capacity, 
            price,
            minSize,
            maxSize,
            breakfast,
            pets
        } = this.state;

        //all the rooms
        let tmpRooms = [...rooms];
        //transform value
        capacity = parseInt(capacity);
        price = parseInt(price);

        //filter by type
        if(type !== "all" ){
            tmpRooms = tmpRooms.filter(room => room.type === type);
        }
        //filter by capacity
        if(capacity !==1){
            tmpRooms = tmpRooms.filter(room => room.capacity >= capacity);
        }
        //filter by price
        tmpRooms =  tmpRooms.filter(room => 
            room.price <= price
        )     

        //filter by size 
        tmpRooms =  tmpRooms.filter(room => 
            room.size >= minSize && room.size <= maxSize
        )  
        
        //filter by breakfast 
        if(breakfast){
            tmpRooms =  tmpRooms.filter(room => 
                room.breakfast === true
            )  
        }
       
        //filter by pets 
        if(pets){
            tmpRooms =  tmpRooms.filter(room => 
                room.pets
            )  
        } 

        //change state
        this.setState({
            sortedRooms: tmpRooms,
        })
    }


    render(){
        return( 
            <RoomContext.Provider value={{ ...this.state,
             getRoom: this.getRoom,
              handleChange: this.handleChange }}>
                {this.props.children}
            </RoomContext.Provider>
        );
    }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component){
    return function ConsumerWrapper(props){
        return <RoomConsumer>
            {value => <Component {...props} context={value}></Component>}
        </RoomConsumer>
    }
}

export { RoomProvider, RoomConsumer, RoomContext }