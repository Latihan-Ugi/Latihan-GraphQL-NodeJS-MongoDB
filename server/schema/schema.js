// import { resolve } from "url";

const graphql = require("graphql");
const _ = require("lodash");

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

// Dummy data
var books = [
    {name:'book1',genre:'genre1',id:'1',authorid:'2'},
    {name:'book2',genre:'genre2',id:'2',authorid:'2'},
    {name:'book3',genre:'genre3',id:'3',authorid:'3'}
];
var authors = [
    {name:'nama1',age:33,id:'1'},
    {name:'nama2',age:43,id:'2'},
    {name:'nama3',age:45,id:'3'}
];

const BookType = new GraphQLObjectType({
    name:'Book',
    fields: () => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorsType,
            resolve(parent,args){
                console.log(parent);
                return _.find(authors,{id:parent.authorid})
            }
        }
    })
});

const AuthorsType = new GraphQLObjectType({
    name:'Author',
    fields: () => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorid:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return _.find(books,{id:args.id});
            }
        },
        author:{
            type:AuthorsType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return _.find(authors,{id:args.id});
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery
})