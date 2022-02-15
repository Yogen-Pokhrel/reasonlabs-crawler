const models = require(__basedir +'/models');
const chalk = require('chalk');
var fs = require('fs');
const axios = require('axios');
const {paginate,queryStringBuilder} = require(__basedir+"/middleware/commonFunctions");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const orderData = require('./data.json');
const { Console } = require('console');

class module_model {
    modelName = models.RemoteFiles;
    moduleName = "Default index file";
    moduleErrorPrefix = 'DEFAULT_INDEX_ERR_';
    totalOrders = 60;
    orders = orderData;
    pendingOrders = [];
    doughChefs = {
      count : 2,
      concurrency: 1,
      timeToPrepare : 700,
      busy: 0
    };

    toppingChefs = {
      count : 3,
      concurrency: 2,
      timeToPrepare : 400,
      busy: 0
    }

    oven = {
      count : 1,
      concurrency: 1,
      timeToPrepare : 1000,
      busy: 0
    }

    waiters = {
      count : 2,
      concurrency: 1,
      timeToPrepare : 500,
      busy: 0
    }

      handleOrder = async () => {
        for(const [item,value] of Object.entries(this.orders)){
          this.pendingOrders.push(item);
          this.preparePizza(item);
        }

        // while(this.pendingOrders.length > 0){
        //   slotsData = this.checkShots();
        //   if(slotsData.slotsAvailable){
        //     // let curOrder = this.pendingOrders.shift();
        //     // this.preparePizza(curOrder);
        //     for(let i = 0; i< this.pendingOrders.length ; i++){
              
        //     }
        //   }
        // }
      }

      getNextOrder = () => {

        if(this.pendingOrders.length > 0){

        }

      }

      checkShots = () => {
        let slotsAvailable = false;
        if(this.doughChefs.count * this.doughChefs.concurrency > this.doughChefs.busy){
          slotsAvailable = true;
          return { slotsAvailable: slotsAvailable, who: "doughChefs"}
        }

        if(this.toppingChefs.count * this.toppingChefs.concurrency > this.toppingChefs.busy){
          slotsAvailable = true;
          return { slotsAvailable: slotsAvailable, who: "toppingChefs"}
        }

        if(this.oven.count * this.oven.concurrency > this.oven.busy){
          slotsAvailable = true;
          return { slotsAvailable: slotsAvailable, who: "oven"}
        }

        if(this.waiters.count * this.waiters.concurrency > this.waiters.busy){
          slotsAvailable = true;
          return { slotsAvailable: slotsAvailable, who: "waiters"}
        }

        return {slotsAvailable: slotsAvailable}
      }

      checkSlotByType = (type) => {

        switch(type){
          case "doughChefs" : 
                              if(this.doughChefs.count * this.doughChefs.concurrency > this.doughChefs.busy){
                                return true;
                              }else{
                                return false;
                              }

          case "toppingChefs" : 
                              if(this.toppingChefs.count * this.toppingChefs.concurrency > this.toppingChefs.busy){
                                return true;
                              }else{
                                return false;
                              }
          case "oven" : 
                              if(this.oven.count * this.oven.concurrency > this.oven.busy){
                                return true;
                              }else{
                                return false;
                              }

          case "waiters" :    if(this.waiters.count * this.waiters.concurrency > this.waiters.busy){
                                return true;
                              }else{
                                return false;
                              }
        }

      }

      preparePizza = async (order) => {
        let classInstance = this;
        let doughChefsAvailable,toppingChefsAvailable,ovenAvailable,waitersAvailable;

        // setTimeout(function(){console.log("Execution")},3000);
        // return false;
        while(this.orders[order].completed !== true){
          classInstance = this;
          if(classInstance.orders[order].taken !== true){
            console.log(order);
            let pendingTasks = false;
            if(classInstance.orders[order].doughChefs !== true){
              pendingTasks = "doughChefs";
              doughChefsAvailable = classInstance.checkSlotByType(pendingTasks);
              if(doughChefsAvailable){
                classInstance.orders[order].taken = true;
                classInstance.doughChefs.busy = classInstance.doughChefs.busy + 1;
                console.log(`${classInstance.orders[order].name} order is given to Dough Chef`);
                console.log(classInstance.doughChefs.timeToPrepare);
                this.registerCallback();
                continue;
              }
            }

            if(classInstance.orders[order].toppingChefs !== true){
              pendingTasks = "toppingChefs";
              toppingChefsAvailable = classInstance.checkSlotByType(pendingTasks);
              if(toppingChefsAvailable){
                classInstance.orders[order].taken = true;
                classInstance.toppingChefs.busy = classInstance.toppingChefs.busy + 1;
                console.log(`${classInstance.orders[order].name} order is given to Topping Chef`);
                // let tt = setTimeout(function(){
                //   classInstance.orders[order].toppingChefs = true;
                //   classInstance.orders[order].taken = false;
                //   classInstance.toppingChefs.busy = classInstance.toppingChefs.busy - 1;
                //   console.log(`${classInstance.orders[order].name} order is completed by Topping Chef`);
                // }, classInstance.toppingChefs.timeToPrepare);

                continue;
              }
            }

            if(classInstance.orders[order].oven !== true){
              pendingTasks = "oven";
              ovenAvailable = classInstance.checkSlotByType(pendingTasks);
              if(ovenAvailable){
                classInstance.orders[order].taken = true;
                classInstance.oven.busy = classInstance.oven.busy + 1;
                console.log(`${classInstance.orders[order].name} order is given to Dough Chef`);
                // setTimeout(() => {
                //   classInstance.orders[order].oven = true;
                //   classInstance.orders[order].taken = true;
                //   classInstance.oven.busy = classInstance.oven.busy - 1;
                //   console.log(`${classInstance.orders[order].name} order is completed by Dough Chef`);
                // }, classInstance.oven.timeToPrepare);

                continue;
              }
            }

            if(classInstance.orders[order].waiters !== true){
              pendingTasks = "waiters";
              waitersAvailable = classInstance.checkSlotByType(pendingTasks);
              if(waitersAvailable){
                classInstance.orders[order].taken = true;
                classInstance.waiters.busy = classInstance.waiters.busy + 1;
                console.log(`${classInstance.orders[order].name} order is given to waiter`);
                // setTimeout(() => {
                //   classInstance.orders[order].waiters = true;
                //   classInstance.orders[order].taken = true;
                //   classInstance.waiters.busy = classInstance.waiters.busy - 1;
                //   console.log(`${classInstance.orders[order].name} order is completed by Waiter and served to customer`);
                // }, classInstance.waiters.timeToPrepare);

                continue;
              }
            }

            if(pendingTasks === false){
              classInstance.orders[order].completed = true;
              // removeItemFromPendingOrders(order);
            }

          }
        }
      }

      registerCallback = async () => {
        
        await timeout(1000);
        let classInstance = this;
        // setTimeout(() => {
          console.log("I am here");
          classInstance.orders[order].doughChefs = true;
          classInstance.orders[order].taken = false;
          classInstance.doughChefs.busy = classInstance.doughChefs.busy - 1;
          console.log(`${classInstance.orders[order].name} order is completed by Dough Chef`);
        // }, 300);
      }

      removeItemFromPendingOrders = (orderId) => {
        
        let peningOrders = this.pendingOrders.filter(function(ele){ 
            return ele != orderId; 
        });

        this.pendingOrders = peningOrders;

      }
}

module.exports = new module_model();