/* eslint-disable */
// @ts-nocheck
// encode html tag
export function utc2Beijing(date) {
  let timestamp = new Date(Date.parse(date))
  timestamp = timestamp.getTime()
  timestamp = timestamp / 1000

  // 增加8个小时，北京时间比utc时间多八个时区
  timestamp = timestamp + 8 * 60 * 60

  // 时间戳转为时间
  const beijingDatetime = new Date(parseInt(timestamp) * 1000)

  const year = beijingDatetime.getFullYear()
  let month = beijingDatetime.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  let day = beijingDatetime.getDate()
  if (day < 10) {
    day = `0${day}`
  }
  let hour = beijingDatetime.getHours()
  if (hour < 10) {
    hour = `0${hour}`
  }
  let minute = beijingDatetime.getMinutes()
  if (minute < 10) {
    minute = `0${minute}`
  }
  let second = beijingDatetime.getSeconds()
  if (second < 10) {
    second = `0${second}`
  }

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export function copyText(test) {
  console.log('copy', test)
  const tag = document.createElement('input')
  tag.setAttribute('id', 'cp_input')
  tag.value = test
  document.getElementsByTagName('body')[0].appendChild(tag)
  document.getElementById('cp_input').select()
  document.execCommand('copy')
  document.getElementById('cp_input').remove()
}

export function getMousePos(event) {
  var e = event || window.event
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop
  var x = e.pageX || e.clientX + scrollX
  var y = e.pageY || e.clientY + scrollY
  return { x: x, y: y }
}
export function HtmlEncode(text) {
  return text
    .replace(/&/g, '&')
    .replace(/\"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>')
}

// add bookmark
export function addFavorite(sURL, sTitle) {
  try {
    window.external.addFavorite(sURL, sTitle)
  } catch (e) {
    try {
      window.sidebar.addPanel(sTitle, sURL, '')
    } catch (e) {
      alert('if failed,please use CTRL + D')
    }
  }
}
// filter all url in currentPage
export const websiteList = document.documentElement.outerHTML
  .match(/(url\(|src=|href=)[\"\']*([^\"\'\(\)\<\>\[\] ]+)[\"\'\)]*|(http:\/\/[\w\-\.]+[^\"\'\(\)\<\>\[\] ]+)/gi)
  .join('\r\n')
  .replace(/^(src=|href=|url\()[\"\']*|[\"\'\>\) ]*$/gim, '')

// dynamtic load script tag
export function appendscript(src, text, reload, charset) {
  const id = hash(src + text)
  if (!reload && in_array(id, evalscripts)) return
  if (reload && $(id)) {
    $(id).parentNode.removeChild($(id))
  }

  evalscripts.push(id)
  const scriptNode = document.createElement('script')
  scriptNode.type = 'text/javascript'
  scriptNode.id = id
  scriptNode.charset = charset || (BROWSER.firefox ? document.characterSet : document.charset)
  try {
    if (src) {
      scriptNode.src = src
      scriptNode.onloadDone = false
      scriptNode.onload = function() {
        scriptNode.onloadDone = true
        JSLOADED[src] = 1
      }
      scriptNode.onreadystatechange = function() {
        if ((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
          scriptNode.onloadDone = true
          JSLOADED[src] = 1
        }
      }
    } else if (text) {
      scriptNode.text = text
    }
    document.getElementsByTagName('head')[0].appendChild(scriptNode)
  } catch (e) {}
}
// back to top of window
export function backTop(btnId) {
  const btn = document.getElementById(btnId)
  const d = document.documentElement
  const b = document.body
  window.onscroll = set
  btn.style.display = 'none'
  btn.onclick = function() {
    btn.style.display = 'none'
    window.onscroll = null
    this.timer = setInterval(function() {
      d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
      b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
      if (d.scrollTop + b.scrollTop == 0) clearInterval(btn.timer, (window.onscroll = set))
    }, 10)
  }
  function set() {
    btn.style.display = d.scrollTop + b.scrollTop > 100 ? 'block' : 'none'
  }
}

// base64 encode
export function base64_decode(data) {
  const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let o1
  let o2
  let o3
  let h1
  let h2
  let h3
  let h4
  let bits
  let i = 0
  let ac = 0
  let dec = ''
  const tmp_arr = []
  if (!data) {
    return data
  }
  data += ''
  do {
    h1 = b64.indexOf(data.charAt(i++))
    h2 = b64.indexOf(data.charAt(i++))
    h3 = b64.indexOf(data.charAt(i++))
    h4 = b64.indexOf(data.charAt(i++))
    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4
    o1 = (bits >> 16) & 0xff
    o2 = (bits >> 8) & 0xff
    o3 = bits & 0xff
    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1)
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2)
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3)
    }
  } while (i < data.length)
  dec = tmp_arr.join('')
  dec = utf8_decode(dec)
  return dec
}

// is valid keypress
export function checkKey(iKey) {
  if (iKey == 32 || iKey == 229) {
    return true
  } /* space和exception */
  if (iKey > 47 && iKey < 58) {
    return true
  } /* number */
  if (iKey > 64 && iKey < 91) {
    return true
  } /* string */
  if (iKey > 95 && iKey < 108) {
    return true
  } /* num keyboard 1 */
  if (iKey > 108 && iKey < 112) {
    return true
  } /* num keyboard 2 */
  if (iKey > 185 && iKey < 193) {
    return true
  } /* punctuation 1 */
  if (iKey > 218 && iKey < 223) {
    return true
  } /* num keyboard 2 */
  return false
}

// iCase
export function chgCase(sStr, iCase) {
  if (typeof sStr !== 'string' || sStr.length <= 0 || !(iCase === 0 || iCase == 1)) {
    return sStr
  }
  let i
  const oRs = []
  let iCode
  if (iCase) {
    /* half - all */
    for (i = 0; i < sStr.length; i += 1) {
      iCode = sStr.charCodeAt(i)
      if (iCode == 32) {
        iCode = 12288
      } else if (iCode < 127) {
        iCode += 65248
      }
      oRs.push(String.fromCharCode(iCode))
    }
  } else {
    /* all->half */
    for (i = 0; i < sStr.length; i += 1) {
      iCode = sStr.charCodeAt(i)
      if (iCode == 12288) {
        iCode = 32
      } else if (iCode > 65280 && iCode < 65375) {
        iCode -= 65248
      }
      oRs.push(String.fromCharCode(iCode))
    }
  }
  return oRs.join('')
}
// compare version
export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')

  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }

  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
// compress css code
export function compressCss(s) {
  s = s.replace(/\/\*(.|\n)*?\*\//g, '')
  s = s.replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
  s = s.replace(/\,[\s\.\#\d]*\{/g, '{')
  s = s.replace(/;\s*;/g, ';')
  s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/)
  return s == null ? '' : s[1]
}

// cross browser to delete events
export function delEvt(obj, evt, fn) {
  if (!obj) {
    return
  }
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false)
  } else if (oTarget.attachEvent) {
    obj.attachEvent('on' + evt, fn)
  } else {
    obj['on' + evt] = fn
  }
}

// get cookie value
export function getCookie(name) {
  const arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr != null) return unescape(arr[2])
  return null
}
// get params in url when method=GET
// example:test.htm?t1=1&t2=2&t3=3, then:GET["t1"], GET["t2"], GET["t3"]
export function getGet() {
  querystr = window.location.href.split('?')
  if (querystr[1]) {
    GETs = querystr[1].split('&')
    GET = []
    for (i = 0; i < GETs.length; i++) {
      tmp_arr = GETs.split('=')
      key = tmp_arr[0]
      GET[key] = tmp_arr[1]
    }
  }
  return querystr[1]
}
// get mobile device's initial size
export function getInitZoom() {
  if (!this._initZoom) {
    let screenWidth = Math.min(screen.height, screen.width)
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
      screenWidth = screenWidth / window.devicePixelRatio
    }
    this._initZoom = screenWidth / document.body.offsetWidth
  }
  return this._initZoom
}
// get page height
export function getPageHeight() {
  const g = document
  const a = g.body
  const f = g.documentElement
  const d = g.compatMode == 'BackCompat' ? a : g.documentElement
  return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight)
}
// get page scrollLeft
export function getPageScrollLeft() {
  const a = document
  return a.documentElement.scrollLeft || a.body.scrollLeft
}
// get page scrollTop
export function getPageScrollTop() {
  const a = document
  return a.documentElement.scrollTop || a.body.scrollTop
}
// get page view height
export function getPageViewHeight() {
  const d = document
  const a = d.compatMode == 'BackCompat' ? d.body : d.documentElement
  return a.clientHeight
}
// get page view width
export function getPageViewWidth() {
  const d = document
  const a = d.compatMode == 'BackCompat' ? d.body : d.documentElement
  return a.clientWidth
}
// get page width
export function getPageWidth() {
  const g = document
  const a = g.body
  const f = g.documentElement
  const d = g.compatMode == 'BackCompat' ? a : g.documentElement
  return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth)
}

export function getScreenWidth() {
  let smallerSide = Math.min(screen.width, screen.height)
  const fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport
  const fixViewPortsExperimentRunning = fixViewPortsExperiment && fixViewPortsExperiment.toLowerCase() === 'new'
  if (fixViewPortsExperiment) {
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
      smallerSide = smallerSide / window.devicePixelRatio
    }
  }
  return smallerSide
}

// is valid url
export function getUrlState(URL) {
  const xmlhttp = new ActiveXObject('microsoft.xmlhttp')
  xmlhttp.Open('GET', URL, false)
  try {
    xmlhttp.Send()
  } catch (e) {
  } finally {
    const result = xmlhttp.responseText
    if (result) {
      if (xmlhttp.Status == 200) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

export function getViewSize() {
  const de = document.documentElement
  const db = document.body
  const viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth
  const viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight
  return [viewW, viewH]
}

export function getZoom() {
  let screenWidth = Math.abs(window.orientation) === 90 ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width)
  if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
    screenWidth = screenWidth / window.devicePixelRatio
  }
  const FixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport
  const FixViewPortsExperimentRunning = FixViewPortsExperiment && (FixViewPortsExperiment === 'New' || FixViewPortsExperiment === 'new')
  if (FixViewPortsExperimentRunning) {
    return screenWidth / window.innerWidth
  } else {
    return screenWidth / document.body.offsetWidth
  }
}

export function isAndroidMobileDevice() {
  return /android/i.test(navigator.userAgent.toLowerCase())
}

export function isAppleMobileDevice() {
  return /iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase())
}

export function isDigit(value) {
  const patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value == '') {
    return false
  } else {
    return true
  }
}

export const isIphonex = () => {
  // X XS, XS Max, XR
  const xSeriesConfig = [
    {
      devicePixelRatio: 3,
      width: 375,
      height: 812
    },
    {
      devicePixelRatio: 3,
      width: 414,
      height: 896
    },
    {
      devicePixelRatio: 2,
      width: 414,
      height: 896
    }
  ]
  // h5
  if (typeof window !== 'undefined' && window) {
    const isIOS = /iphone/gi.test(window.navigator.userAgent)
    if (!isIOS) return false
    const { devicePixelRatio, screen } = window
    const { width, height } = screen
    return xSeriesConfig.some(item => item.devicePixelRatio === devicePixelRatio && item.width === width && item.height === height)
  }
  return false
}
// //判断是否移动设备
export function isMobile() {
  if (typeof this._isMobile === 'boolean') {
    return this._isMobile
  }
  let screenWidth = this.getScreenWidth()
  const fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport
  const fixViewPortsExperimentRunning = fixViewPortsExperiment && fixViewPortsExperiment.toLowerCase() === 'new'
  if (!fixViewPortsExperiment) {
    if (!this.isAppleMobileDevice()) {
      screenWidth = screenWidth / window.devicePixelRatio
    }
  }
  const isMobileScreenSize = screenWidth < 600
  const isMobileUserAgent = false
  this._isMobile = isMobileScreenSize && this.isTouchScreen()
  return this._isMobile
}

export function isMobileNumber(e) {
  const i = '134,135,136,137,138,139,150,151,152,157,158,159,187,188,147,182,183,184,178'
  const n = '130,131,132,155,156,185,186,145,176'
  const a = '133,153,180,181,189,177,173,170'
  const o = e || ''
  const r = o.substring(0, 3)
  const d = o.substring(0, 4)
  const s = !!/^1\d{10}$/.test(o) && (n.indexOf(r) >= 0 ? '联通' : a.indexOf(r) >= 0 ? '电信' : d == '1349' ? '电信' : i.indexOf(r) >= 0 ? '移动' : '未知')
  return s
}

export function isMobileUserAgent() {
  return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase())
}

export function isMouseOut(e, handler) {
  if (e.type !== 'mouseout') {
    return false
  }
  let reltg = e.relatedTarget ? e.relatedTarget : e.type === 'mouseout' ? e.toElement : e.fromElement
  while (reltg && reltg !== handler) {
    reltg = reltg.parentNode
  }
  return reltg !== handler
}

export function isTouchScreen() {
  return 'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)
}

export function isURL(strUrl) {
  const regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
  if (regular.test(strUrl)) {
    return true
  } else {
    return false
  }
}

export function isViewportOpen() {
  return !!document.getElementById('wixMobileViewport')
}

export function loadStyle(url) {
  try {
    document.createStyleSheet(url)
  } catch (e) {
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.type = 'text/css'
    cssLink.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(cssLink)
  }
}

export function locationReplace(url) {
  if (history.replaceState) {
    history.replaceState(null, document.title, url)
    history.go(0)
  } else {
    location.replace(url)
  }
}

export function getOffset(e) {
  const target = e.target
  let eventCoord
  let pageCoord
  let offsetCoord
  pageCoord = getPageCoord(target)
  eventCoord = {
    X: window.pageXOffset + e.clientX,
    Y: window.pageYOffset + e.clientY
  }

  offsetCoord = {
    X: eventCoord.X - pageCoord.X,
    Y: eventCoord.Y - pageCoord.Y
  }
  return offsetCoord
}

export function getPageCoord(element) {
  const coord = { X: 0, Y: 0 }
  while (element) {
    coord.X += element.offsetLeft
    coord.Y += element.offsetTop
    element = element.offsetParent
  }
  return coord
}

export function openWindow(url, windowName, width, height) {
  const x = parseInt(screen.width / 2.0) - width / 2.0
  const y = parseInt(screen.height / 2.0) - height / 2.0
  const isMSIE = navigator.appName == 'Microsoft Internet Explorer'
  if (isMSIE) {
    let p = 'resizable=1,location=no,scrollbars=no,width='
    p = p + width
    p = p + ',height='
    p = p + height
    p = p + ',left='
    p = p + x
    p = p + ',top='
    p = p + y
    retval = window.open(url, windowName, p)
  } else {
    const win = window.open(url, 'ZyiisPopup', 'top=' + y + ',left=' + x + ',scrollbars=' + scrollbars + ',dialog=yes,modal=yes,width=' + width + ',height=' + height + ',resizable=no')
    eval('try { win.resizeTo(width, height); } catch(e) { }')
    win.focus()
  }
}

export const fnParams2Url = obj => {
  const aUrl = []
  const fnAdd = function(key, value) {
    return key + '=' + value
  }
  for (const k in obj) {
    aUrl.push(fnAdd(k, obj[k]))
  }
  return encodeURIComponent(aUrl.join('&'))
}

export function removeUrlPrefix(a) {
  a = a
    .replace(/：/g, ':')
    .replace(/．/g, '.')
    .replace(/／/g, '/')
  while (
    trim(a)
      .toLowerCase()
      .indexOf('http://') == 0
  ) {
    a = trim(a.replace(/http:\/\//i, ''))
  }
  return a
}

export function setCookie(name, value, Hours) {
  const d = new Date()
  const offset = 8
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  const nd = utc + 3600000 * offset
  const exp = new Date(nd)
  exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString() + ';domain=360doc.com;'
}

export function setSort() {
  const text = K1.value
    .split(/[\r\n]/)
    .sort()
    .join('\r\n')
  const test = K1.value
    .split(/[\r\n]/)
    .sort()
    .reverse()
    .join('\r\n')
  K1.value = K1.value != text ? text : test
}

export function* sleepGenerator(time) {
  yield new Promise(function(resolve, reject) {
    setTimeout(resolve, time)
  })
}

export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export function timeFormat(time) {
  const date = new Date(time)
  const curDate = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 10
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const curYear = curDate.getFullYear()
  const curHour = curDate.getHours()
  let timeStr

  if (year < curYear) {
    timeStr = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute
  } else {
    const pastTime = curDate - date
    const pastH = pastTime / 3600000

    if (pastH > curHour) {
      timeStr = month + '月' + day + '日 ' + hour + ':' + minute
    } else if (pastH >= 1) {
      timeStr = '今天 ' + hour + ':' + minute + '分'
    } else {
      const pastM = curDate.getMinutes() - minute
      if (pastM > 1) {
        timeStr = pastM + '分钟前'
      } else {
        timeStr = '刚刚'
      }
    }
  }
  return timeStr
}

export function toCDB(str) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i)
    if (code >= 65281 && code <= 65374) {
      result += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else if (code == 12288) {
      result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32)
    } else {
      result += str.charAt(i)
    }
  }
  return result
}

export function uniqueId(): number {
  const a: any = Math.random
  const b: any = parseInt
  return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a())
}

export function utf8_decode(str_data) {
  const tmp_arr = []
  let i = 0
  let ac = 0
  let c1 = 0
  let c2 = 0
  let c3 = 0
  str_data += ''
  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i)
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1)
      i++
    } else if (c1 > 191 && c1 < 224) {
      c2 = str_data.charCodeAt(i + 1)
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
      i += 2
    } else {
      c2 = str_data.charCodeAt(i + 1)
      c3 = str_data.charCodeAt(i + 2)
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
      i += 3
    }
  }
  return tmp_arr.join('')
}

export function getFullNum(num) {
  //处理非数字
  if (isNaN(num)) {
    return num
  }

  //处理不需要转换的数字
  var str = '' + num
  if (!/e/i.test(str)) {
    return num
  }

  return num.toFixed(18).replace(/\.?0+$/, '')
}
