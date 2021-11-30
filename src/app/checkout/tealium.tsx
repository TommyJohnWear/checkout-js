export default function initTealium() {
  let a:any = '//tags.tiqcdn.com/utag/tealiumlabs/reactjs/dev/utag.js';
  let b:any = document;
  let c:any = 'script';
  let d:any = b.createElement(c);
  d.src=a;
  d.type = 'text/java' + c;
  d.async = true;
  a = b.getElementsByTagName(c)[0];
  a.parentNode.insertBefore(d, a);
};
