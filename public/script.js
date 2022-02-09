async function main(botId) {
  let widgetHeight = "85vh";
  let maxWidgetHeight = "555px";
  let widgetWidth = "345px";
  let widgetMargin = "0.625rem";
  let notificationBoxHeight = "200px";
  let notificationBoxWidth = "200px";
  let notificationBoxBottom = "100px";
  let notificationVisible = false;

  const notificationMessageCss = `.chat360__notification-box{height:16rem;width:9rem!important;background-color:#fff;position:absolute;bottom:70px;right:-4px;border-radius:2px;z-index:-1;box-shadow:0 0 20px rgba(0,0,0,.1);right:100%;margin-right:12px;padding:4px 10px 4px 10px;border-radius:5px;width:-webkit-max-content;width:-moz-max-content;width:max-content}`;

  const css = `.chat360__chatbox{z-index:2147483000;position:fixed;bottom:0;right:0;margin:${widgetMargin};height:${widgetHeight};border-radius:.5rem;-webkit-box-shadow:0 0 1rem rgba(0,0,0,.1);box-shadow:0 0 1rem rgba(0,0,0,.1);display:none}.chat360__btn{height:60px;width:60px;background-image:-webkit-gradient(linear,left top,right top,from(#327acc),to(#1f5ea3));background-image:linear-gradient(to right,#327acc,#1f5ea3);border-radius:50%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer}.chat360__btn-logo1{height:100%;width:100%}.chat360__btn-logo{height:50%;width:50%}.chat360__btn-cross{display:flex;display:-ms-flexbox;justify-content:center;align-items:center;border-radius:50%;height:22px;width:22px;;right:100%;bottom:100%;background-color:#fff;position: absolute;cursor:pointer;-webkit-transform:translate(50%,50%);transform:translate(50%,50%);-webkit-box-shadow:0 0 20px rgba(0,0,0,.15);box-shadow:0 0 20px rgba(0,0,0,.15);transition:.2s transform ease-in-out;-webkit-transition:.2s transform ease-in-out;-webkit-transform-origin:bottom right;transform-origin:bottom right;}.chat360__btn-label{color:#373f4a;margin:0;white-space:pre-wrap;font-family:sans-serif;font-size:13px;display:block;overflow:hidden;}.chat360__btn-label-cutout{height:12px;width:12px;background-color:#fff;position:absolute;bottom:6px;-webkit-transform:rotate(45deg);transform:rotate(45deg);right:-4px;border-radius:2px;z-index:-1}.chat360__btn-label-container{opacity:0; line-height: 23px; display:flex;flex-direction:column;position:absolute;bottom:17px;background-color:#fff;-webkit-box-shadow:0 0 20px rgba(0,0,0,.1);box-shadow:0 0 20px rgba(0,0,0,.1);right:100%;margin-right:12px;padding:4px 10px 4px 10px;border-radius:5px;width:-webkit-max-content;width:-moz-max-content;width:max-content}.chat360__btn-container{position:fixed;bottom:20px;right:20px;z-index:3147483000;opacity:0}.chat360__btn-label-container:hover .chat360__btn-cross{display:flex;}.chat360__btn-cross:hover{-webkit-transform:scale(1.2)translate(50%,50%);transform:scale(1.2)translate(50%,50%);}@keyframes fadein{0%{opacity:0}100%{opacity:1}}${notificationMessageCss}@media only screen and (min-width:500px){.chat360__chatbox{max-height:${maxWidgetHeight};}.chat360__btn-cross{display:none;}}`,
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  head.appendChild(style);
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  let audio;
  try {
    audio = new Audio(
      "https://app.gaadibaazar.in/media/widget_media/widget_audio.mpga"
    );
  } catch (err) {}

  const checkIfMobile = () => {
    return window.innerWidth < 500;
  };

  const domain = `app.gaadibaazar.in`;
  const baseUrl = `https://${domain}/api`;
  const origin = window.location.origin;
  let websiteUrl = `${window.location.host}${window.location.pathname}`;
  const url = `${baseUrl}/chatbox/${botId}/chatboxappeareance?website_url=${websiteUrl}`;
  const res = await fetch(url);
  if (res.status >= 400) return;
  try {
    audio.play();
  } catch {}
  const resData = await res.json();
  const botInfo = JSON.parse(resData.json_info);
  const notificationInfo = resData.notifications?.data;
  const botLogoColor = botInfo.botLogoColor;
  const colors = JSON.parse(botInfo.custom_theme).background.match(
    /#[0-9a-f]{3,6}/gi
  );

  const elChatBox = document.createElement("div");
  const elChatBtn = document.createElement("div");
  const elNotificationBox = document.createElement("div");
  let timer = null;

  elChatBox.classList.add("chat360__chatbox");

  const resizeIfMobile = () => {
    const isMobile = checkIfMobile();
    if (isMobile) {
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0"
        );
    }

    elChatBox.style.width = notificationVisible
      ? notificationBoxWidth
      : isMobile
      ? "auto"
      : widgetWidth;
    elChatBox.style.height = notificationVisible
      ? notificationBoxHeight
      : isMobile
      ? "auto"
      : widgetHeight;
    elChatBox.style.top = isMobile && !notificationVisible ? "0" : "auto";
    elChatBox.style.left = isMobile && !notificationVisible ? "0" : "auto";
    elChatBox.style.margin =
      isMobile && !notificationVisible ? "0" : widgetMargin;
    elChatBox.style.right = !notificationVisible && "0";
    elChatBox.style.bottom = !notificationVisible && "0";
  };

  resizeIfMobile();
  window.addEventListener("resize", () => {
    resizeIfMobile();
  });

  const elIframe = document.createElement("iframe");
  elIframe.setAttribute("frameborder", "0");
  elIframe.setAttribute("allowfullscreen", "true");
  elIframe.setAttribute("height", "100%");
  elIframe.setAttribute("width", "100%");
  elIframe.setAttribute("allow", "geolocation;microphone");
  elIframe.setAttribute(
    "src",
    `https://${domain}/clientwidget?origin=${origin}&h=${botId}`
  );
  elChatBox.appendChild(elIframe);
  let delay = 1;
  let labelDelay = Number(botInfo.buttonlabeldelay) || 1;
  const containerContent = `
  <div class="chat360__btn-container" style="animation: .5s ${delay}s fadein ease-in-out 1 forwards" >
  <div class="chat360__btn" style="background-image:-webkit-gradient(linear,left top,right top,from(${botLogoColor}),to(${botLogoColor}));background-image:linear-gradient(to right,${botLogoColor},${botLogoColor});overflow:hidden">
    ${
      botInfo.widget_image
        ? `
      <img class="chat360__btn-logo1" style="object-fit:cover; object-position: center" src="${botInfo.widget_image}" alt="" />
    `
        : `
      <svg
        class="chat360__btn-logo"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="26.236"
        height="26.338"
        viewBox="0 0 26.236 26.338"
      >
        <defs>
          <style>
            .a {
              fill: url(#a);
            }
            .b {
              fill: url(#b);
            }
            .c {
              fill: #fff;
            }
            .d {
              fill: url(#c);
            }
          </style>
          <linearGradient
            id="a"
            x1="-0.117"
            y1="1.135"
            x2="0.9"
            y2="0.023"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#fff" />
            <stop offset="0.21" stop-color="#fff" />
            <stop offset="0.68" stop-color="#e7ecf2" />
            <stop offset="1" stop-color="#dce3eb" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="1.122"
            y1="1.293"
            x2="0.283"
            y2="0.423"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#fff" />
            <stop offset="0.21" stop-color="#fff" />
            <stop offset="0.78" stop-color="#e7ecf2" />
            <stop offset="1" stop-color="#e7ecf2" />
          </linearGradient>
          <linearGradient
            id="c"
            x1="1.206"
            y1="1.314"
            x2="-0.045"
            y2="0.23"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#fff" />
            <stop offset="0.21" stop-color="#fff" />
            <stop offset="0.78" stop-color="#d9e1ea" />
            <stop offset="1" stop-color="#dbe2ea" />
          </linearGradient>
        </defs>
        <g transform="translate(0 0)">
          <g transform="translate(0 0.981)">
            <path
              class="a"
              d="M180.8,204.6a25.528,25.528,0,0,1-10.275,3.924,7.593,7.593,0,1,0-7.879-12.066,25.629,25.629,0,0,0-5.781,10.392c-.019.066-.038.138-.057.207q-.151.563-.264,1.137l-.471,4.257q-.024.646-.024,1.3h0l-.011-.986-.12,1.086v-.156l-.018-7.96.018-4.553a12.678,12.678,0,0,1,25.278-1.4h0c.008.071.015.143.021.214a.059.059,0,0,1,0,.015c.005.055.01.11.014.166,0,.026,0,.053.007.081q.015.213.023.428a.135.135,0,0,1,0,.016A13.587,13.587,0,0,1,180.8,204.6Z"
              transform="translate(-155.9 -188.5)"
            />
            <path
              class="b"
              d="M360.346,204.6a25.528,25.528,0,0,1-10.275,3.924,7.593,7.593,0,0,0-1.931-14.938V188.5a12.682,12.682,0,0,1,12.6,11.274h0c.008.071.015.143.021.214a.057.057,0,0,1,0,.015c.005.055.01.11.014.166,0,.026,0,.053.007.081q.015.213.023.428a.124.124,0,0,1,0,.016A13.587,13.587,0,0,1,360.346,204.6Z"
              transform="translate(-335.446 -188.5)"
            />
            <ellipse
              class="c"
              cx="1.123"
              cy="1.123"
              rx="1.123"
              ry="1.123"
              transform="translate(11.505 11.555)"
            />
            <ellipse
              class="c"
              cx="1.123"
              cy="1.123"
              rx="1.123"
              ry="1.123"
              transform="translate(7.807 11.555)"
            />
            <ellipse
              class="c"
              cx="1.123"
              cy="1.123"
              rx="1.123"
              ry="1.123"
              transform="translate(15.203 11.555)"
            />
            <path
              class="d"
              d="M168.773,321.314h-.195l-.152-.007h0A7.593,7.593,0,0,1,162.87,309a25.6,25.6,0,0,0-6.73,17.333v.057c3.378-2.575,11.532-4.8,12.44-5.053h0Z"
              transform="translate(-156.124 -301.043)"
            />
            <path
              class="c"
              d="M180.983,364.167c-.026.092-.051.184-.078.273l-.027.088c-.015.05-.03.1-.046.148a12.271,12.271,0,0,1-2.26,4.118l-.007.009-.1.124-.113.132a12.647,12.647,0,0,1-9.574,4.367H156.1a.009.009,0,0,1,0,0,.01.01,0,0,1,0,0l.08-.06.051-.039h0a25.531,25.531,0,0,1,12.309-4.952h0l.19-.023h.047a7.59,7.59,0,0,0,1.351-.12q.3-.053.582-.129c3.7-.549,10.127-4.16,10.658-8.65v-.006l.009-.087.01.092c0,.04.008.081.011.121a.06.06,0,0,1,0,.015c.005.055.01.11.014.166,0,.026,0,.053.007.081q.015.213.023.428a.136.136,0,0,1,0,.017A13.588,13.588,0,0,1,180.983,364.167Z"
              transform="translate(-156.083 -348.069)"
            />
          </g>
          <path
            class="c"
            d="M165.16,830.977a.616.616,0,0,1,.751.751l-1.08,4.148a.616.616,0,0,1-1.031.28l-3.068-3.068a.616.616,0,0,1,.28-1.031Z"
            transform="translate(-139.694 -830.957)"
          />
        </g>
      </svg>`
    }
    </div>
    ${
      botInfo.button_label
        ? `

    <div class="chat360__btn-label-container" style="animation: .5s ${labelDelay}s fadein ease-in-out 1 forwards"> 
      <div class="chat360__btn-cross">
        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 24 24" width="14px" fill="#373f4a"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </div> 
      <label class="chat360__btn-label">${
        botInfo.label_text && botInfo.label_text.trim()
      }</label>
      <div class="chat360__btn-label-cutout"></div>
    </div>`
        : ``
    }
  </div>
  `;

  elChatBtn.innerHTML += containerContent;

  document.body.appendChild(elChatBox);
  document.body.appendChild(elChatBtn);
  document.body.appendChild(elNotificationBox);

  function createPopupEl() {
    const popup = document.createElement("div");
    const popupContent = `
    <style>
      .chat360-popup {
        opacity: 0;
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 4147483000;
        transition: all 0.5s;
      }
      .chat360-popup-backdrop {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
      }
      .chat360-popup-container {
        width: 800px;
        height: 500px;
        background-color: #fff;
        padding: 1rem;
        border-radius: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      .chat360-popup-container-content {
        height: calc(100% - 2rem);
        position: absolute;
        width: calc(100% - 2rem);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .chat360-popup-close {
        position: absolute;
        padding: 10px;
        background-color: rgba(239, 68, 68, 1);
        border-radius: 50%;
        right: 1rem;
        top: 1rem;
        cursor: pointer;
        z-index: 100;
      }
    </style>
    <div class='chat360-popup-backdrop'></div>
    <div class='chat360-popup-container'>
      <div class='chat360-popup-close'></div>
      <svg class="" style="height: 100%;position: absolute;top: 0px;left: 0px;z-index: 0;border-radius:20px;" data-name="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390.25 373.75"><defs></defs><title>cbimage</title><path style="fill: rgb(140, 125, 216); opacity: 0.364;" class="wave-path" d="M0,0H123.21S78.08,119.5,224.35,129.28c0,0,48-2,48.64,52.07,0,2.78.14,12.52.14,12.52-.46,10.93-4.46,41.88,2.63,70.54,15,60.8,93.83,100.38,114.25,109.27.31.14.34,0,0,0H0Z" transform="translate(0 0)"></path></svg>
      <div class='chat360-popup-container-content'>
        ${
          botInfo.show_exit_popup_custom && botInfo.show_exit_popup_custom_html
            ? botInfo.show_exit_popup_custom_html
            : `
        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
          <h1 style="max-width: 70%;font-family: 'Open Sans', sans-serif;text-align: center;color: rgb(31, 41, 55);">Convert visitors into customers with Chat360's exit intent feature</h1>
          <button style="padding: 10px 20px;font-family: 'Open Sans', sans-serif;cursor: pointer;background-color: #327acc;border: none;color: #fff;font-weight: 600;text-transform: uppercase;border-radius: 6px;font-size: 20px;">Register now</button>
        </div>
        `
        }
      </div>
    </div>
  `;
    popup.classList.add("chat360-popup");

    popup.innerHTML += popupContent;
    document.body.appendChild(popup);
    const popupBackdrop = document.querySelector(".chat360-popup-backdrop");
    const closeBtn = document.querySelector(".chat360-popup-close");
    popupBackdrop.addEventListener("click", () => {
      popup.style.opacity = 0;
      popup.style.pointerEvents = "none";
    });
    closeBtn.addEventListener("click", () => {
      popup.style.opacity = 0;
      popup.style.pointerEvents = "none";
    });
    return popup;
  }

  if (botInfo.show_exit_popup) {
    let popupShowed = false;
    const popup = createPopupEl();

    document.addEventListener("mouseout", (e) => {
      e = e ? e : window.event;
      const from = e.relatedTarget || e.toElement;
      if ((!from || from.nodeName === "HTML") && !popupShowed) {
        popupShowed = true;
        popup.style.opacity = 1;
        popup.style.pointerEvents = "all";
      }
    });
  }

  const chatBtn = document.querySelector(".chat360__btn");
  const chatBtnContainer = document.querySelector(".chat360__btn-container");
  const chatBtnLabelContainer = document.querySelector(
    ".chat360__btn-label-container"
  );
  const chatLabelCross = document.querySelector(".chat360__btn-cross");

  let chatboxVisible = false;

  const toggleChatBox = () => {
    timer && clearTimeout(timer);
    chatboxVisible = !chatboxVisible;
    if (chatboxVisible) {
      notificationVisible = false;
      elChatBox.style.height = widgetHeight;
      elChatBox.style.width = widgetWidth;
      elChatBox.style.bottom = "0";
      resizeIfMobile();
      elChatBox.style.display = "block";
      chatBtnContainer.style.display = "none";
    } else {
      elChatBox.style.display = "none";
      chatBtnContainer.style.display = "block";
    }
    elIframe.contentWindow.postMessage(
      { type: "TOGGLE_CHATBOX_VISIBILITY", visible: chatboxVisible },
      "*"
    );
  };

  const toggleNotification = (data) => {
    notificationVisible = true;
    elChatBox.style.height = notificationBoxHeight;
    elChatBox.style.width = notificationBoxWidth;
    elChatBox.style.display = "block";
    elChatBox.style.bottom = notificationBoxBottom;
    elIframe.contentWindow.postMessage(
      { type: "GET_NOTICIATIONDATA", notificationData: data },
      "*"
    );
    resizeIfMobile();
  };

  const hideNotificationBox = () => {
    notificationVisible = false;
    elChatBox.style.height = widgetHeight;
    elChatBox.style.width = widgetWidth;
    elChatBox.style.display = "none";
    elChatBox.style.bottom = "0";
    resizeIfMobile();
  };

  const checkNotification = () => {
    if (notificationInfo?.length > 0) {
      let parent_url = window.location.href;
      if (checkIfMobile()) parent_url = parent_url.split("?")[0];
      let slicedParentUrl =
        parent_url[parent_url.length - 1] === "/"
          ? parent_url.slice(0, -1)
          : parent_url;
      const filterInfo = notificationInfo.filter((eachInfo) => {
        const removedSlashUrl =
          eachInfo?.url[eachInfo.url?.length - 1] === "/"
            ? eachInfo.url?.slice(0, -1)
            : eachInfo?.url;
        return removedSlashUrl == slicedParentUrl;
      });
      if (filterInfo?.length > 0) {
        setTimeout(() => {
          !chatboxVisible && toggleNotification(filterInfo[0]);
        }, filterInfo[0]?.notificationDelay * 1000);
      }
    }
  };

  const toggleLabel = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    chatBtnLabelContainer.style.display = "none";
    chatLabelCross.style.display = "none";
  };

  function receiveMessage(event) {
    if (event.origin !== `https://${domain}`) {
      return;
    }
    if (event.data.type === "LOCALSTORE_IFRAM") {
      switch (event.data.action) {
        case "remove": {
          localStorage.removeItem(event.data.key);
          break;
        }
        case "toggleChatbox": {
          toggleChatBox();
          break;
        }
        case "hideNotificationBox": {
          hideNotificationBox();
          break;
        }
        case "get": {
          let data = localStorage.getItem(event.data.key);
          if (data) data = JSON.parse(data);
          elIframe.contentWindow.postMessage(
            { [event.data.key]: data, type: "GET_LOCALDATA" },
            "*"
          );
          break;
        }
        case "getBotInfo": {
          elIframe.contentWindow.postMessage(
            {
              type: "BOT_INFO",
              config: {
                ...resData,
                isMobile: checkIfMobile(),
                origin: window.location.origin,
              },
            },
            "*"
          );
          break;
        }
        case "getUtm": {
          elIframe.contentWindow.postMessage(
            {
              utmData: window.location.search.substring(1),
              parent_url: window.location.origin,
              subdomain_url: window.location.href,
              type: "GET_UTM",
            },
            "*"
          );
          break;
        }
        case "set": {
          localStorage.setItem(event.data.key, event.data.val);
          break;
        }
        default:
          return;
      }
    }
  }
  window.addEventListener("message", receiveMessage, false);
  chatBtn.addEventListener("click", toggleChatBox);
  chatBtnLabelContainer.addEventListener("click", (e) => {
    toggleChatBox();
  });
  chatLabelCross.addEventListener("click", toggleLabel);

  const init = async () => {
    if (botInfo.defaultOpen) {
      if (+botInfo.defaultOpenDelay) {
        timer = setTimeout(toggleChatBox, +botInfo.defaultOpenDelay * 1000);
      } else {
        toggleChatBox();
      }
    }
    elChatBtn.style.background = colors[1];
    elChatBtn.style.opacity = 1;
    elChatBtn.style.pointerEvents = "all";
    chatBtnContainer.style.opacity = 1;
    chatBtnContainer.style.animation = "none";
    checkNotification();
  };
  if (delay > 0) {
    elIframe.onload = setTimeout.bind(null, () => init(), delay * 1000);
  } else {
    window.onload = init;
  }
  botInfo.tracking &&
    botInfo.tracking.google_analytics &&
    createGoogleAnalyticIntegration(domain);
  botInfo.tracking &&
    botInfo.tracking.gtm_container_id &&
    createGTMIntegration(domain);
}

function createGoogleAnalyticIntegration(domain) {
  let trackerName = "";
  window.ga &&
    window.ga(function () {
      if (window.ga.getByName("chat360_bot")) {
        trackerName = "chat360_bot.";
      }
    });
  window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== `https://${domain}`) {
        return;
      }
      if (event.data.type !== "CHAT360___G___EVENT") return;
      window.ga &&
        window.ga(
          trackerName + "send",
          "event",
          event.data.category,
          event.data.action,
          event.data.label
        );
    },
    false
  );
}

function createGTMIntegration(domain) {
  window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== `https://${domain}`) {
        return;
      }
      if (event.data.type !== "CHAT360___GTM___EVENT") return;
      window["dataLayer"] && window["dataLayer"].push(event.data.layer);
    },
    false
  );
}

const loadChat360Bot = (botId) => {
  main(botId).catch((err) => {
    if (err.message.includes("appendChild")) {
      setTimeout(() => loadChat360Bot(botId), 1000);
    }
  });
};
