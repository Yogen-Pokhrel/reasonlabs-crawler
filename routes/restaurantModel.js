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
      timeToPrepare : 7000,
      busy: 0
    };

    toppingChefs = {
      count : 3,
      concurrency: 2,
      timeToPrepare : 4000,
      busy: 0
    }

    oven = {
      count : 1,
      concurrency: 1,
      timeToPrepare : 10000,
      busy: 0
    }

    waiters = {
      count : 2,
      concurrency: 1,
      timeToPrepare : 5000,
      busy: 0
    }

      handleOrder = async () => {
        for(const [item,value] of Object.entries(this.orders)){
          this.pendingOrders.push(item);
        }
        this.preparePizza();
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

      preparePizza = () => {
        let classInstance = this;
        let doughChefsAvailable,toppingChefsAvailable,ovenAvailable,waitersAvailable, message;

        // setTimeout(function(){console.log("Execution")},3000);
        // return false;
        // while(this.pendingOrders.length > 0 && i < 90000){
        let restaurantProcess = setInterval(() => {
  
          classInstance = this;
          let order = this.pendingOrders[Math.floor(Math.random() * this.pendingOrders.length)];
         
          if(classInstance.orders[order].taken == true){
            return;
          }

          // setTimeout(() => {
          //   console.log("I am inside timeout");
          // },100)
   
            let pendingTasks = false;
            if(classInstance.orders[order].doughChefs !== true){
       
              pendingTasks = "doughChefs";
              doughChefsAvailable = classInstance.checkSlotByType(pendingTasks);
              if(doughChefsAvailable){
                classInstance.orders[order].taken = true;
                classInstance.doughChefs.busy = classInstance.doughChefs.busy + 1;
                message = `${classInstance.orders[order].name} order is given to Dough Chef at ${new Date()}`;
                console.log(chalk.yellow(message));
                classInstance.saveLogs(order,message);
                  setTimeout(function(){
                    message = `${classInstance.orders[order].name} order is completed by Dough Chef at ${new Date()}`;
                    classInstance.saveLogs(order,message);
                    console.log(chalk.green(message));
                    classInstance.orders[order].doughChefs = true;
                    classInstance.orders[order].taken = false;
                    classInstance.doughChefs.busy = classInstance.doughChefs.busy - 1;
                    doughChefsAvailable = classInstance.checkSlotByType("doughChefs");
  
                  }, classInstance.doughChefs.timeToPrepare);
                return;;
              }else{
                return;;
              }
            }

            if(classInstance.orders[order].toppingChefs !== true){
              pendingTasks = "toppingChefs";
              toppingChefsAvailable = classInstance.checkSlotByType(pendingTasks);
              if(toppingChefsAvailable){
                classInstance.orders[order].taken = true;
                classInstance.toppingChefs.busy = classInstance.toppingChefs.busy + 1;
                message = `${classInstance.orders[order].name} order is given to Topping Chef at ${new Date()}`;
                classInstance.saveLogs(order,message);
                console.log(chalk.blue(message));
                setTimeout(function(){
                  classInstance.orders[order].toppingChefs = true;
                  classInstance.orders[order].taken = false;
                  classInstance.toppingChefs.busy = classInstance.toppingChefs.busy - 1;
                  message = `${classInstance.orders[order].name} order is completed by Topping Chef at ${new Date()}`;
                  classInstance.saveLogs(order,message);
                  console.log(chalk.cyan(message));


                }, classInstance.toppingChefs.timeToPrepare);

                return;;
              }else{
                return;;
              }
            }

            if(classInstance.orders[order].oven !== true){
              pendingTasks = "oven";
              ovenAvailable = classInstance.checkSlotByType(pendingTasks);
              if(ovenAvailable){
                classInstance.orders[order].taken = true;
                classInstance.oven.busy = classInstance.oven.busy + 1;

                message = `${classInstance.orders[order].name} order is given to Oven at ${new Date()}`;
                classInstance.saveLogs(order,message);
                console.log(chalk.magentaBright(message));

                setTimeout(() => {
                  classInstance.orders[order].oven = true;
                  classInstance.orders[order].taken = false;
                  classInstance.oven.busy = classInstance.oven.busy - 1;

                  message = `${classInstance.orders[order].name} order is completed by Oven at ${new Date()}`;
                  classInstance.saveLogs(order,message);
                  console.log(chalk.yellowBright(message));

                }, classInstance.oven.timeToPrepare);

                return;;
              }else{
                return;;
              }
            }
      
            if(classInstance.orders[order].waiters !== true){
              pendingTasks = "waiters";
              waitersAvailable = classInstance.checkSlotByType(pendingTasks);
              if(waitersAvailable){
                classInstance.orders[order].taken = true;
                classInstance.waiters.busy = classInstance.waiters.busy + 1;
                
                message = `${classInstance.orders[order].name} order is given to waiter at ${new Date()}`;
                classInstance.saveLogs(order,message);
                console.log(chalk.bgYellow(message));

                setTimeout(() => {
                  classInstance.orders[order].waiters = true;
                  classInstance.orders[order].taken = false;
                  classInstance.waiters.busy = classInstance.waiters.busy - 1;

                  message = `${classInstance.orders[order].name} order is completed by Waiter and served to customer at ${new Date()}`;
                  classInstance.saveLogs(order,message);
                  console.log(chalk.bgGreen(message));

                }, classInstance.waiters.timeToPrepare);

                return;;
              }else{
                return;;
              }
            }

            if(pendingTasks === false){
              // classInstance.orders[order].completed = true;
              classInstance.removeItemFromPendingOrders(order);
            }

            if(classInstance.pendingOrders.length <= 0){
              console.log(chalk.red('Process End, No More Orders'));
              clearInterval(restaurantProcess);
            }

            
          }, 100);
      }

      removeItemFromPendingOrders = (orderId) => {
        
        let peningOrders = this.pendingOrders.filter(function(ele){ 
            return ele != orderId; 
        });
        console.log(chalk.red(`${this.orders[orderId].name} has completed his/her order, removed from the pending list.`))
        this.pendingOrders = peningOrders;

      }

      saveLogs = async (orderId, message) => {

        let insertData = {
            customerName:this.orders[orderId].name,
            orderId: orderId,
            message: message,
            isPublished:1, // 1 -> Published, 0 -> Unpublished
            isDeleted:0, // 0 -> Not Deleted, 1 -> Deleted
        }

        models.RestaurantLogs.create(insertData).then(obj => {
            // console.log(obj);
        }).catch(err => {
            console.log(err);
        })
      }
}

module.exports = new module_model();