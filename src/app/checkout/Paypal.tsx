export default function initPaypal() {
  let a:any = 'https://www.paypal.com/sdk/js?client-id=Ae72mMA9it0Ibd9gefaU6NX41IHvErnMuLIuRae9QwnPVukeUBpobzo3ZJKJ3w3NWizaOCoyjIJqmVlB&components=messages,buttons';
  let b:any = document;
  let c:any = 'script';
  let d:any = b.createElement(c);
  d.src=a;
  d.type = 'text/java' + c;
  d.async = true;
  a = b.getElementsByTagName(c)[0];
  a.parentNode.insertBefore(d, a);
};
