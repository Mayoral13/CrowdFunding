 const Crowd = artifacts.require("Crowdfunding");
 let catchRevert = require("../execption").catchRevert;
contract("crowdy",(accounts) => {

   let timestamp = Date.now();
    const user1 = accounts[2];
    const user = accounts[1];
    const admin = accounts[0];
    it("Should deploy successfully",async()=>{
        const meta = await Crowd.deployed();
        const address = await meta.address;
        console.log("Address is :",address.toString());
        assert(address !== "");
    });
    it("Can set target",async()=>{
        const value = 160;
        const meta = await Crowd.deployed();
        const target = await meta.SetTarget(160);
        const result  = await meta.ShowTarget();
        assert.equal(value,result);

    });
    it("Can set time",async()=>{
        const value = timestamp + 1000;
        const meta = await Crowd.deployed();
        console.log("The time stamp is:",timestamp.toString());
        const set = await meta.SetTime(timestamp + 1000);
        const stop = await meta.ShowStop();
        console.log("Set time is: ",stop.toString());
        assert.equal(value,stop);

    });

    it("Can show target",async()=>{
        const value = 160;
        const meta = await Crowd.deployed();
        const target = await meta.SetTarget(160);
        const result  = await meta.ShowTarget();
        console.log("Result is :",result.toString());
        assert.equal(value,result);
    });
    it("Can show stop",async()=>{
        const value = timestamp + 10000;
        const meta = await Crowd.deployed();
        console.log("The time stamp is:",timestamp.toString());
        const set = await meta.SetTime(timestamp+10000);
        const stop = await meta.ShowStop();
        console.log("Set time is: ",stop.toString());
        assert.equal(value,stop);

    });
    it("Can show Start",async()=>{
        const meta = await Crowd.deployed();
        const beta = await meta.ShowStart();
        console.log("Time stamp is: ",beta.toString());
        assert(beta !== "");

    });
    it("Can Change Owner",async()=>{
        const meta = await Crowd.deployed();
        const beta = await meta.ShowOwner();
        console.log("First owner is: ",beta.toString());
        const gamma = await meta.ChangeOwner(user,{from:admin});
        const alpha = await meta.ShowOwner();
        console.log("Second owner is: ",alpha.toString());
        assert(beta !== alpha);
    });

    it("Should revert if non admin tries to change owner",async()=>{
        const user1 = accounts[2];
        const meta = await Crowd.deployed();
        await catchRevert(meta.ChangeOwner(user,{from:user1}));
    });

    it("Should revert if time set is smaller than current timestamp",async()=>{
        const meta = await Crowd.deployed();
        console.log("The time stamp is:",timestamp.toString());
        await catchRevert(meta.SetTime(50));
    });
    it("Should revert if target is set to 0",async()=>{
        const meta = await Crowd.deployed();
       await catchRevert(meta.SetTarget(0));
        
    });
    it("Can perform funding successfully",async()=>{
        const meta = await Crowd.deployed();
        const gamma = await meta.SetTarget(10);
        const alpha = meta.SetTime(2654997642);
        const balanceBefore = await meta.Balance();
        console.log("Balance Before :",balanceBefore.toString());
        const beta = await meta.Funding(user1,{from:admin,value:5});
        const balanceAfter = await meta.Balance();
        console.log("Balance After is:",balanceAfter.toString());
        assert.equal(balanceAfter,5);
    });
    it("Should revert if time is 0",async()=>{
        const meta = await Crowd.deployed();
        const gamma = await meta.SetTarget(10);
        await catchRevert(meta.SetTime(0));
         const alpha = await meta.Funding(user1,{from:admin,value:5});

    });
    it("Balance should be 0 upon deployment",async()=>{
        const meta = await Crowd.deployed();
        const balance = await meta.Balance();
        console.log("Balance is:",balance.toString());
        assert.equal(balance,0);

    });








});