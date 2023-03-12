var app = getApp();
var calc = require("../../utils/calc");
var firebase = require("../../utils/firebase-app.js");

Page({
  data: {
    //baseUrl: "http://localhost:8081", //local server
    baseUrl: "https://node-api-muxu.onrender.com", // global server
    //baseUrl: "http://196.189.44.60:8888/miniapp/auth/token",
    token: "",
    error: {},
    success: "",
    isLoading: false,
    selectedWaresInfo: undefined,
    userData: {
      open_id: "",
      identityId: "",
      identityType: "CUSTOMER",
      walletIdentityId: "202000000000146178",
      identifierType: "MSISDN",
      identifier: "", //PhoneNumber
      nickName: "", // FirstName
      status: "", // Default is 03 it means active
    },
    waresList: [
      {
        id: 1,
        imageType: 1,
        price: 1000,
        currency: "USD",
        title: "diamond_1",
        className: "per perb",
      },
      {
        id: 2,
        imageType: 2,
        price: 2000,
        currency: "USD",
        title: "diamond_2",
        selected: false,
        className: "per perb",
      },
      {
        id: 3,
        imageType: 3,
        price: 5000,
        currency: "USD",
        title: "diamond_3",
        selected: false,
        className: "per perb",
      },
      {
        id: 4,
        imageType: 4,
        price: 10000,
        currency: "USD",
        title: "diamond_4",
        selected: false,
        className: "per perb",
      },
      {
        id: 5,
        imageType: 5,
        price: 20000,
        currency: "USD",
        title: "diamond_5",
        selected: false,
        className: "per perb",
      },
      {
        id: 6,
        imageType: 6,
        price: 50000,
        currency: "USD",
        title: "diamond_6",
        selected: false,
        className: "per perb",
      },
      {
        id: 7,
        imageType: 7,
        price: 100000,
        currency: "Ks",
        title: "diamond_7",
        selected: false,
        className: "per perb",
      },
    ],
  },
  //For automatic login you can use set it onload state
  // onload() {
  //   this.applyH5Token();
  // },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  waresSelect(e) {
    let itemid = e.currentTarget.dataset.itemid;
    let selectedItem;
    this.data.waresList.map((el) => {
      if (el.id == itemid) {
        selectedItem = el;
        el.className = "per per-act";
      } else {
        el.className = "per perb";
      }
    });
    this.setData({
      selectedWaresInfo: selectedItem,
      waresList: this.data.waresList,
    });
  },

  buyGoods() {
    if (!this.data.selectedWaresInfo) {
      ma.showToast({ title: "please select a ware" });
      return;
    }
    ma.request({
      url: this.data.baseUrl + "/create/order",
      method: "POST",
      data: {
        title: this.data.selectedWaresInfo.title,
        amount: this.data.selectedWaresInfo.price + "",
      },
      success: (res) => {
        this.startPay(res.data);
      },
    });
  },

  startPay(rawRequest) {
    console.log({ rawRequest: rawRequest.trim() });
    ma.startPay({
      rawRequest: rawRequest.trim(),
      success: (res) => {
        ma.showToast({ title: "res = " + res.resultCode });
      },
    });
  },

  //Bellow you can find the Auth login Implementaion

  //Obtaining the MiniApp Token(access_token)
  applyH5Token() {
    ma.getMiniAppToken({
      appId: "930231098009602",
      success: (res) => {
        console.log("res", res);
        this.setData({
          ...this.data,
          isLoading: true,
        });
        //passing the access_token value for reqAuthToken function as argument
        this.reqAuthToken(res.token);
      },

      fail: (err) => {
        console.log("WE ARE FOUND AN ERROR!", err);
      },
    });
  },

  //Verifying the MiniApp Token(access_token) and Returning User Information
  reqAuthToken(accessToken) {
    ma.request({
      url: this.data.baseUrl + "/apply/h5token",
      mode: "no-cors",
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: {
        authToken: accessToken,
      },

      success: (res) => {
        console.log("*******SUCCESS - applyH5Token**********");
        // const result = JSON.parse(res);
        const {
          open_id,
          identityId,
          identityType,
          walletIdentityId,
          identifierType,
          identifier,
          nickName,
          status,
        } = res.data.biz_content;

        //Setting incoming data from from superApp server.
        this.setData({
          ...this.data,
          isLoading: false,
          success: res.data.biz_content,
          userData: {
            ...this.data.userData,
            open_id: open_id,
            identityId: identityId,
            identityType: identityType,
            walletIdentityId: walletIdentityId,
            identifier: identifier, //phone no
            nickName: nickName, // firstName
            status: status,
          },
        });

        console.log(res);
      },
      fail: (err) => {
        console.log("********ERROR - applyH5Token************");
        this.setData({
          ...this.data,
          error: JSON.stringify(err),
        });
        ma.showToast({
          title: `${JSON.stringify(err)}`,
        })({ content: `${JSON.stringify(err)}` });
        console.log(err);
      },
    });
  },
});
