(window.webpackJsonpCheckout=window.webpackJsonpCheckout||[]).push([[5],{1734:function(e,t,n){"use strict";var a=n(2),r=n(41),o=n.n(r),s=n(0),i=n.n(s),c=n(564),l=n(562),d=Object(s.forwardRef)((function(e,t){var n=e.additionalClassName,r=e.label,s=e.id,d=Object(a.__rest)(e,["additionalClassName","label","id"]);return i.a.createElement(i.a.Fragment,null,i.a.createElement(c.a,Object(a.__assign)({},d,{className:o()("form-checkbox","optimizedCheckout-form-checkbox",n),id:s,ref:t,type:"checkbox"})),i.a.createElement(l.a,{htmlFor:s},r))}));t.a=d},1742:function(e,t,n){"use strict";var a=n(2),r=n(41),o=n.n(r),s=n(0),i=n.n(s),c=Object(s.forwardRef)((function(e,t){var n=e.additionalClassName,r=e.testId,s=e.className,c=Object(a.__rest)(e,["additionalClassName","testId","className"]);return i.a.createElement("textarea",Object(a.__assign)({},c,{className:s||o()("form-input","optimizedCheckout-form-input",n),"data-test":r,ref:t}))}));t.a=c},1748:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(2),r=n(10);function o(e,t){return!(!e||!t)&&(Object(r.isEqual)(s(e),s(t))&&function(e,t){if(e.stateOrProvince&&e.stateOrProvince===t.stateOrProvince)return!0;if(e.stateOrProvinceCode&&e.stateOrProvinceCode===t.stateOrProvinceCode)return!0;return e.stateOrProvince===t.stateOrProvince&&e.stateOrProvinceCode===t.stateOrProvinceCode}(e,t))}function s(e){return Object(r.omit)(Object(a.__assign)(Object(a.__assign)({},e),{customFields:(e.customFields||[]).filter((function(e){return!!e.fieldValue}))}),["id","shouldSaveAddress","stateOrProvince","stateOrProvinceCode","type","email","country"])}},1750:function(e,t,n){},1761:function(e,t,n){},1764:function(e,t,n){},1765:function(e,t,n){},1766:function(e,t,n){},1767:function(e,t,n){},1780:function(e,t,n){"use strict";var a=n(2),r=n(10),o=n(0),s=n.n(o),i=n(568),c=n(1734),l=n(566);t.a=Object(o.memo)((function(e){var t=e.additionalClassName,n=e.disabled,d=void 0!==n&&n,u=e.labelContent,m=e.onChange,p=e.name,h=e.id,f=Object(o.useCallback)((function(e){var t=e.field;return s.a.createElement(o.Fragment,null,s.a.createElement(c.a,Object(a.__assign)({},t,{checked:!!t.value,disabled:d,id:h||t.name,label:u})),s.a.createElement(l.a,{name:p,testId:Object(r.kebabCase)(p)+"-field-error-message"}))}),[d,h,u,p]);return s.a.createElement(i.a,{additionalClassName:t,name:p,onChange:m,render:f})}))},1781:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var a=n(575);function r(e){return Object(a.a)(e.lineItems.physicalItems.filter((function(e){return!e.addedByPromotion})))}},1787:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var a=n(10);function r(e){var t=[];return Object(a.forIn)(e,(function(e,n){var r;if(Object(a.isDate)(e)){var o=Object(a.padStart)((e.getMonth()+1).toString(),2,"0"),s=Object(a.padStart)(e.getDate().toString(),2,"0");r=e.getFullYear()+"-"+o+"-"+s}else r=e;t.push({fieldId:n,fieldValue:r})})),t}},1788:function(e,t,n){"use strict";var a=n(2),r=n(0),o=n.n(r),s=n(1754),i=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={shouldShow:!1},t.handleClick=function(e){t.state.shouldShow?t.handleClose(e.nativeEvent):t.handleOpen(e.nativeEvent)},t.handleOpen=function(){t.state.shouldShow||t.setState({shouldShow:!0},(function(){document.addEventListener("click",t.handleClose)}))},t.handleClose=function(){t.state.shouldShow&&t.setState({shouldShow:!1},(function(){document.removeEventListener("click",t.handleClose)}))},t}return Object(a.__extends)(t,e),t.prototype.componentWillUnmount=function(){document.removeEventListener("click",this.handleClose)},t.prototype.render=function(){var e=this,t=this.props,n=t.children,r=t.placement,i=t.dropdown,c=this.state.shouldShow;return o.a.createElement(s.Manager,null,o.a.createElement(s.Reference,null,(function(t){var a=t.ref;return o.a.createElement("div",{className:"dropdownTrigger",onClick:e.handleClick,ref:a},n)})),o.a.createElement(s.Popper,{modifiers:{hide:{enabled:!1},flip:{enabled:!1},preventOverflow:{enabled:!1}},placement:r},(function(e){var t=e.ref,n=e.style;return c?o.a.createElement("div",{className:"dropdownMenu",ref:t,style:Object(a.__assign)(Object(a.__assign)({},n),{width:"100%",zIndex:1})},i):null})))},t.defaultProps={placement:"bottom-start"},t}(r.Component);t.a=i},1845:function(e,t,n){"use strict";var a=n(2),r=n(113),o=n(10),s=n(0),i=n.n(s),c=n(560),l=n(393),d=n(233),u=n(1721),m=n(1849),p=n(1780),h={address1:"addressLine1",address2:"addressLine2",postalCode:"postCode",stateOrProvince:"province",stateOrProvinceCode:"provinceCode"};function f(e){return""+(h[e]||e)}function g(e){return f(e)+"Input"}var b=function(){function e(e){var t=e.address_components,n=e.name;this._name=n,this._address=t}return e.prototype.getState=function(){return this._get("administrative_area_level_1","short_name")},e.prototype.getStreet=function(){return this._name},e.prototype.getStreet2=function(){return""},e.prototype.getCity=function(){return this._get("postal_town","long_name")||this._get("locality","long_name")||this._get("neighborhood","short_name")},e.prototype.getCountry=function(){return this._get("country","short_name")},e.prototype.getPostCode=function(){return this._get("postal_code","short_name")},e.prototype._get=function(e,t){var n=this._address&&this._address.find((function(t){return-1!==t.types.indexOf(e)}));return n?n[t]:""},e}(),v=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Object(a.__extends)(t,e),t.prototype.getState=function(){return this._get("administrative_area_level_2","long_name")},t.prototype.getStreet2=function(){return this._get("locality","long_name")},t}(b),_=function(){function e(){}return e.create=function(e){var t=new b(e);switch(t.getCountry()){case"GB":return new v(e)}return t},e}();var C=n(1694),O=n(562),y=n(1791),j=n.n(y),E=(n(1766),function(e){var t=e.children;return i.a.createElement("div",{className:"popover"},t)});n(1767);function S(e,t){var n=["popoverList-item"];return e===t&&n.push("is-active"),n.join(" ")}var A,k=Object(s.memo)((function(e){var t=e.highlightedIndex,n=void 0===t?-1:t,r=e.testId,o=e.getItemProps,s=void 0===o?function(e){return e}:o,c=e.menuProps,l=void 0===c?{}:c,d=e.items;return d&&d.length?i.a.createElement("ul",Object(a.__assign)({className:"popoverList","data-test":r},l),d.map((function(e,t){return i.a.createElement("li",Object(a.__assign)({className:S(n,t),"data-test":r&&r+"-item"},s({key:e.id,index:t,item:e}),{key:t}),e.content)}))):null})),w=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.stateReducer=function(e,n){var r=t.props.onChange;switch(n.type){case j.a.stateChangeTypes.blurInput:case j.a.stateChangeTypes.blurButton:case j.a.stateChangeTypes.mouseUp:case j.a.stateChangeTypes.touchEnd:return Object(a.__assign)(Object(a.__assign)({},n),{inputValue:e.inputValue});case j.a.stateChangeTypes.changeInput:return n.inputValue!==e.inputValue&&r&&r(n.inputValue||"",e.isOpen),n;case j.a.stateChangeTypes.keyDownEnter:default:return n}},t.handleStateChange=function(e){var n=e.isOpen,a=e.inputValue,r=t.props.onToggleOpen,s=void 0===r?o.noop:r;void 0!==n&&s({isOpen:n,inputValue:a||""})},t}return Object(a.__extends)(t,e),t.prototype.render=function(){var e=this,t=this.props,n=t.inputProps,r=t.initialValue,s=t.initialHighlightedIndex,c=t.items,l=t.children,d=t.onSelect,u=t.listTestId;return i.a.createElement(j.a,{defaultHighlightedIndex:0,initialHighlightedIndex:s,initialInputValue:r,itemToString:this.itemToString,labelId:n&&n["aria-labelledby"]?n["aria-labelledby"]:null,onChange:d,onStateChange:this.handleStateChange,stateReducer:this.stateReducer},(function(t){var r=t.isOpen,s=t.getInputProps,d=t.getMenuProps,m=t.getItemProps,p=t.highlightedIndex;return i.a.createElement("div",null,i.a.createElement("input",Object(a.__assign)({},s(),n)),r&&!!c.length&&i.a.createElement(E,null,i.a.createElement(k,{getItemProps:m,highlightedIndex:Object(o.isNumber)(p)?p:-1,items:c.map((function(t){return e.toPopoverItem(t)})),menuProps:d(),testId:u}),l))}))},t.prototype.toPopoverItem=function(e){return Object(a.__assign)(Object(a.__assign)({},e),{content:this.highlightItem(e)})},t.prototype.highlightItem=function(e){if(!e.highlightedSlices||!e.highlightedSlices.length)return e.label;var t=0,n=0;return e.highlightedSlices.reduce((function(a,r,o){var c=e.label,l=r.offset,d=r.length,u=l-t;return u&&(a.push(i.a.createElement(s.Fragment,{key:n},c.substr(t,u))),n+=1),t=l+d,a.push(i.a.createElement("strong",{key:n},c.substr(l,d))),n+=1,o===(e.highlightedSlices||[]).length-1&&(a.push(i.a.createElement(s.Fragment,{key:n},c.substr(t))),n+=1),a}),[])},t.prototype.itemToString=function(e){return e&&e.value||""},t}(s.PureComponent),N=(n(1765),n(850)),P=function(){function e(){this._scriptLoader=Object(N.getScriptLoader)()}return e.prototype.loadMapsSdk=function(e){var t=this;return this._googleAutoComplete?this._googleAutoComplete:(this._googleAutoComplete=new Promise((function(n,a){var r=["language=en","key="+e,"libraries=places","callback=initAutoComplete"].join("&");window.initAutoComplete=function(){(function(e){var t=e;return Boolean(t.google&&t.google.maps&&t.google.maps.places)})(window)&&n(window.google.maps),a()},t._scriptLoader.loadScript("//maps.googleapis.com/maps/api/js?"+r).catch((function(e){throw t._googleAutoComplete=void 0,e}))})),this._googleAutoComplete)},e}();var I=function(){function e(e,t){void 0===t&&(A||(A=new P),t=A),this._apiKey=e,this._scriptLoader=t}return e.prototype.getAutocompleteService=function(){return this._autocompletePromise||(this._autocompletePromise=this._scriptLoader.loadMapsSdk(this._apiKey).then((function(e){if(!e.places.AutocompleteService)throw new Error("`AutocompleteService` is undefined");return new e.places.AutocompleteService}))),this._autocompletePromise},e.prototype.getPlacesServices=function(){var e=document.createElement("div");return this._placesPromise||(this._placesPromise=this._scriptLoader.loadMapsSdk(this._apiKey).then((function(t){if(!t.places.PlacesService)throw new Error("`PlacesService` is undefined");return new t.places.PlacesService(e)}))),this._placesPromise},e}(),x=function(e){function t(t){var n=e.call(this,t)||this;return n.onSelect=function(e){var t=n.props,a=t.fields,r=t.onSelect,s=void 0===r?o.noop:r,i=t.nextElement;n.googleAutocompleteService.getPlacesServices().then((function(t){t.getDetails({placeId:e.id,fields:a||["address_components","name"]},(function(t){i&&i.focus(),s(t,e)}))}))},n.onChange=function(e){var t=n.props,a=t.isAutocompleteEnabled,r=t.onChange;if((void 0===r?o.noop:r)(e,!1),!a)return n.resetAutocomplete();n.setAutocomplete(e),n.setItems(e)},n.googleAutocompleteService=new I(t.apiKey),n.state={items:[],autoComplete:"off"},n}return Object(a.__extends)(t,e),t.prototype.render=function(){var e=this.props,t=e.initialValue,n=e.onToggleOpen,r=void 0===n?o.noop:n,s=e.inputProps,c=void 0===s?{}:s,l=this.state,d=l.autoComplete,u=l.items;return i.a.createElement(w,{initialHighlightedIndex:0,initialValue:t,inputProps:Object(a.__assign)(Object(a.__assign)({},c),{autoComplete:d}),items:u,listTestId:"address-autocomplete-suggestions",onChange:this.onChange,onSelect:this.onSelect,onToggleOpen:r},i.a.createElement("div",{className:"co-googleAutocomplete-footer"}))},t.prototype.setItems=function(e){var t=this;if(e){var n=this.props,a=n.componentRestrictions,r=n.types;this.googleAutocompleteService.getAutocompleteService().then((function(n){n.getPlacePredictions({input:e,types:r||["geocode"],componentRestrictions:a},(function(e){return t.setState({items:t.toAutocompleteItems(e)})}))}))}else this.setState({items:[]})},t.prototype.resetAutocomplete=function(){this.setState({items:[],autoComplete:"off"})},t.prototype.setAutocomplete=function(e){this.setState(Object(a.__assign)(Object(a.__assign)({},this.state),{autoComplete:e&&e.length?"nope":"off"}))},t.prototype.toAutocompleteItems=function(e){return(e||[]).map((function(e){return{label:e.description,value:e.structured_formatting.main_text,highlightedSlices:e.matched_substrings,id:e.place_id}}))},t}(s.PureComponent),F=Object(s.memo)((function(e){var t=e.field,n=t.default,a=t.name,r=e.countryCode,o=e.supportedCountries,l=e.parentFieldName,d=e.nextElement,u=e.apiKey,m=e.onSelect,p=e.onChange,h=e.onToggleOpen,b=l?l+"."+a:a,v=Object(s.useMemo)((function(){return i.a.createElement(c.a,{id:"address.address_line_1_label"})}),[]),_=function(e){return f(e)+"Label"}(a),y=Object(s.useMemo)((function(){return{className:"form-input optimizedCheckout-form-input",id:g(a),"aria-labelledby":_,placeholder:n}}),[a,_,n]),j=Object(s.useCallback)((function(e){var t=e.field;return i.a.createElement(x,{apiKey:u,componentRestrictions:r?{country:r}:void 0,initialValue:t.value,inputProps:y,isAutocompleteEnabled:!!r&&o.indexOf(r)>-1,nextElement:d,onChange:p,onSelect:m,onToggleOpen:h})}),[u,r,y,d,p,m,h,o]);return i.a.createElement("div",{className:"dynamic-form-field dynamic-form-field--addressLineAutocomplete"},i.a.createElement(C.a,{input:j,label:i.a.createElement(O.a,{htmlFor:y.id,id:_},v),name:b}))})),T=(n(1764),{address1:"address.address_line_1_label",address2:"address.address_line_2_label",city:"address.city_label",company:"address.company_name_label",countryCode:"address.country_label",firstName:"address.first_name_label",lastName:"address.last_name_label",phone:"address.phone_number_label",postalCode:"address.postal_code_label",stateOrProvince:"address.state_label",stateOrProvinceCode:"address.state_label"}),V={address1:"address-line1",address2:"address-line2",city:"address-level2",company:"organization",countryCode:"country",firstName:"given-name",lastName:"family-name",phone:"tel",postalCode:"postal-code",stateOrProvince:"address-level1",stateOrProvinceCode:"address-level1"},L={countryCode:"address.select_country_action",stateOrProvince:"address.select_state_action",stateOrProvinceCode:"address.select_state_action"},M="address1",z=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.containerRef=Object(s.createRef)(),t.handleDynamicFormFieldChange=Object(r.memoize)((function(e){return function(n){t.syncNonFormikValue(e,n)}})),t.handleAutocompleteChange=function(e,n){n||t.syncNonFormikValue(M,e)},t.handleAutocompleteSelect=function(e,n){var r=n.value,s=t.props,i=s.countries,c=s.setFieldValue,l=void 0===c?o.noop:c,d=s.onChange,u=void 0===d?o.noop:d,m=function(e,t){if(void 0===t&&(t=[]),!e||!e.address_components)return{};var n=_.create(e),r=n.getState(),o=n.getCountry(),s=t&&t.find((function(e){return o===e.code})),i=n.getStreet2();return Object(a.__assign)({address2:i,city:n.getCity(),countryCode:o,postalCode:n.getPostCode()},r?function(e,t){void 0===t&&(t=[]);var n=t.find((function(t){var n=t.code,a=t.name;return n===e||a===e}));if(!n)return{stateOrProvince:t.length?"":e,stateOrProvinceCode:""};return{stateOrProvince:n.name,stateOrProvinceCode:n.code}}(r,s&&s.subdivisions):{})}(e,i);Object(o.forIn)(m,(function(e,t){l(t,e),u(t,e)})),r&&t.syncNonFormikValue(M,r)},t.syncNonFormikValue=function(e,n){var a=t.props,r=a.formFields,s=a.setFieldValue,i=void 0===s?o.noop:s,c=a.onChange,l=void 0===c?o.noop:c,u=r.filter((function(e){return e.custom&&e.fieldType===d.a.date})).map((function(e){return e.name}));(e===M||u.indexOf(e)>-1)&&i(e,n),l(e,n)},t}return Object(a.__extends)(t,e),t.prototype.componentDidMount=function(){var e=this.containerRef.current;e&&(this.nextElement=e.querySelector('[autocomplete="address-line2"]'))},t.prototype.render=function(){var e=this,t=this.props,n=t.formFields,a=t.fieldName,r=t.countriesWithAutocomplete,o=t.countryCode,s=t.googleMapsApiKey,l=t.onAutocompleteToggle,d=t.shouldShowSaveAddress;return i.a.createElement(i.a.Fragment,null,i.a.createElement(u.a,null,i.a.createElement("div",{className:"checkout-address",ref:this.containerRef},n.map((function(t){var n=t.name,d=L[n];return"address1"===n&&s&&r?i.a.createElement(F,{apiKey:s,countryCode:o,field:t,key:t.id,nextElement:e.nextElement||void 0,onChange:e.handleAutocompleteChange,onSelect:e.handleAutocompleteSelect,onToggleOpen:l,parentFieldName:a,supportedCountries:r}):i.a.createElement(m.a,{autocomplete:V[t.name],extraClass:"dynamic-form-field--"+f(n),field:t,inputId:g(n),key:t.id+"-"+t.name,label:t.custom?t.label:i.a.createElement(c.a,{id:T[t.name]}),onChange:e.handleDynamicFormFieldChange(n),parentFieldName:t.custom?a?a+".customFields":"customFields":a,placeholder:e.getPlaceholderValue(t,d)})})))),d&&i.a.createElement(p.a,{labelContent:i.a.createElement(c.a,{id:"address.save_in_addressbook"}),name:a?a+".shouldSaveAddress":"shouldSaveAddress"}))},t.prototype.getPlaceholderValue=function(e,t){var n=this.props.language;return e.default&&"dropdown"!==e.fieldType?e.default:t&&n.translate(t)},t}(s.Component);t.a=Object(l.a)(z)},1849:function(e,t,n){"use strict";var a=n(2),r=n(0),o=n.n(r),s=n(560),i=n(144),c=n(10),l=n(233),d=n(1768),u=n.n(d),m=n(843),p=n(222),h=Object(m.a)(p.a,{displayNamePrefix:"withDate",pickProps:function(e,t){return"date"===t&&!!e}}),f=n(1734),g=n(41),b=n.n(g),v=n(564),_=n(562),C=Object(r.forwardRef)((function(e,t){var n=e.additionalClassName,r=e.label,s=e.value,i=e.checked,c=e.id,l=Object(a.__rest)(e,["additionalClassName","label","value","checked","id"]);return o.a.createElement(o.a.Fragment,null,o.a.createElement(v.a,Object(a.__assign)({},l,{checked:i,className:b()("form-radio","optimizedCheckout-form-radio",n),id:c,ref:t,type:"radio",value:s})),o.a.createElement(_.a,{htmlFor:c},r))})),O=n(1742),y=n(1693),j=Object(r.memo)(h((function(e){e.additionalClassName;var t=e.date,n=e.fieldType,s=e.id,i=e.name,d=e.onChange,m=void 0===d?c.noop:d,p=e.options,h=e.placeholder,g=e.value,b=Object(a.__rest)(e,["additionalClassName","date","fieldType","id","name","onChange","options","placeholder","value"]),v=t.inputFormat,_=Object(r.useCallback)((function(e,t){return m(Object(a.__assign)(Object(a.__assign)({},t),{target:{name:i,value:e}}))}),[m,i]);switch(n){case l.a.dropdown:return o.a.createElement("select",Object(a.__assign)({},b,{className:"form-select optimizedCheckout-form-select","data-test":s+"-select",id:s,name:i,onChange:m,value:null===g?"":g}),h&&o.a.createElement("option",{value:""},h),p&&p.map((function(e){var t=e.label,n=e.value;return o.a.createElement("option",{key:n,value:n},t)})));case l.a.radio:return p&&p.length?o.a.createElement(o.a.Fragment,null,p.map((function(e){var t=e.label,n=e.value;return o.a.createElement(C,Object(a.__assign)({},b,{checked:n===g,id:s+"-"+n,key:n,label:t,name:i,onChange:m,testId:s+"-"+n+"-radio",value:n}))}))):null;case l.a.checkbox:return p&&p.length?o.a.createElement(o.a.Fragment,null,p.map((function(e){var t=e.label,n=e.value;return o.a.createElement(f.a,Object(a.__assign)({},b,{checked:!!Array.isArray(g)&&g.includes(n),id:s+"-"+n,key:n,label:t,name:i,onChange:m,testId:s+"-"+n+"-checkbox",value:n}))}))):null;case l.a.date:return o.a.createElement(u.a,Object(a.__assign)({},b,{autoComplete:"off",calendarClassName:"optimizedCheckout-contentPrimary",className:"form-input optimizedCheckout-form-input",dateFormat:v,maxDate:b.max?new Date(b.max+"T00:00:00Z"):void 0,minDate:b.min?new Date(b.min+"T00:00:00Z"):void 0,name:i,onChange:_,placeholderText:v.toUpperCase(),popperClassName:"optimizedCheckout-contentPrimary",selected:Object(c.isDate)(g)?g:void 0}));case l.a.multiline:return o.a.createElement(O.a,Object(a.__assign)({},b,{id:s,name:i,onChange:m,testId:s+"-text",type:n,value:g}));default:return o.a.createElement(y.a,Object(a.__assign)({},b,{id:s,name:i,onChange:m,placeholder:h,testId:s+"-"+(n===l.a.password?"password":"text"),type:n,value:g}))}}))),E=n(571),S=n(566),A=(n(1750),Object(r.memo)((function(e){var t=e.testId,n=e.onSelectedAll,a=e.onSelectedNone,i=Object(r.useCallback)((function(e){e.preventDefault(),n()}),[n]),c=Object(r.useCallback)((function(e){e.preventDefault(),a()}),[a]);return o.a.createElement("ul",{className:"multiCheckbox--controls"},o.a.createElement("li",{className:"multiCheckbox--control"},o.a.createElement(s.a,{id:"address.select"})),o.a.createElement("li",{className:"multiCheckbox--control"},o.a.createElement("a",{"data-test":t+"Checkbox-all-button",href:"#",onClick:i},o.a.createElement(s.a,{id:"address.select_all"}))),o.a.createElement("li",{className:"multiCheckbox--control"},o.a.createElement("a",{"data-test":t+"Checkbox-none-button",href:"#",onClick:c},o.a.createElement(s.a,{id:"address.select_none"}))))}))),k=function(e){var t=e.form,n=t.values,a=t.errors,s=e.id,d=e.label,u=e.name,m=e.onChange,p=void 0===m?c.noop:m,h=e.options,f=e.push,g=e.remove,b=Object(r.useCallback)((function(){var e=Object(i.getIn)(n,u)||[];Object(c.difference)(h.map((function(e){return e.value})),e).forEach((function(e){return f(e)})),p(Object(i.getIn)(n,u))}),[u,p,h,f,n]),v=Object(r.useCallback)((function(){(Object(i.getIn)(n,u)||[]).forEach((function(){return g(0)})),p(Object(i.getIn)(n,u))}),[u,p,g,n]),_=Object(r.useCallback)((function(e){var t=Object(i.getIn)(n,u)||[],a=e.target,r=a.value;a.checked?f(r):g(t.indexOf(r)),p(Object(i.getIn)(n,u))}),[u,p,f,g,n]);return o.a.createElement(E.a,{hasError:Object(i.getIn)(a,u)&&Object(i.getIn)(a,u).length},d,h.length>1&&o.a.createElement(A,{onSelectedAll:b,onSelectedNone:v,testId:s}),o.a.createElement(j,{fieldType:l.a.checkbox,id:s,name:u,onChange:_,options:h,value:Object(i.getIn)(n,u)||[]}),o.a.createElement(S.a,{name:u,testId:Object(c.kebabCase)(u)+"-field-error-message"}))},w=Object(r.memo)((function(e){var t=e.id,n=e.label,s=e.name,l=e.onChange,d=e.options,u=Object(r.useCallback)((function(e){return o.a.createElement(k,Object(a.__assign)({id:t,label:n,name:s,onChange:l,options:d},Object(c.pick)(e,["form","pop","push","remove"])))}),[t,n,s,l,d]);return o.a.createElement(i.FieldArray,{name:s,render:u})})),N=n(1694);t.a=Object(r.memo)((function(e){var t=e.field,n=t.fieldType,i=t.type,c=t.secret,d=t.name,u=t.label,m=t.required,p=t.options,h=t.max,f=t.min,g=t.maxLength,b=e.parentFieldName,v=e.onChange,C=e.placeholder,O=e.inputId,y=e.autocomplete,E=e.label,S=e.extraClass,A=O||d,k=b?b+"."+d:d,P=Object(r.useMemo)((function(){return o.a.createElement(_.a,{htmlFor:A},E||u,!m&&o.a.createElement(o.a.Fragment,null," ",o.a.createElement("small",{className:"optimizedCheckout-contentSecondary"},o.a.createElement(s.a,{id:"common.optional_text"}))))}),[A,u,m,E]),I=Object(r.useMemo)((function(){return"text"===n?"integer"===i?l.a.number:c?l.a.password:l.a.text:n}),[n,i,c]),x=Object(r.useCallback)((function(e){var t=e.field;return o.a.createElement(j,Object(a.__assign)({},t,{autoComplete:y,fieldType:I,id:A,max:h,maxLength:g||void 0,min:f,options:p&&p.items,placeholder:C||p&&p.helperLabel,rows:p&&p.rows}))}),[A,h,g,f,p,C,I,y]);return o.a.createElement("div",{className:"dynamic-form-field "+S},n===l.a.checkbox?o.a.createElement(w,{id:A,label:P,name:k,onChange:v,options:p&&p.items||[]}):o.a.createElement(N.a,{input:x,label:P,name:k,onChange:v}))}))},1863:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(2),r=n(1787);function o(e){var t=e.customFields,n=Object(a.__rest)(e,["customFields"]),o=e.shouldSaveAddress;return Object(a.__assign)(Object(a.__assign)({},n),{shouldSaveAddress:o,customFields:Object(r.a)(t)})}},1864:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n(10),r=n(1748),o=n(574);function s(e,t,n){return!(!e||!Object(o.a)(e,n))&&Object(a.some)(t,(function(t){return Object(r.a)(t,e)}))}},1865:function(e,t,n){"use strict";var a=n(2),r=n(0),o=n.n(r),s=n(1683),i=n(560),c=n(1788),l=n(1748),d=(n(1761),n(855)),u=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.handleSelectAddress=function(e){var n=t.props,a=n.onSelectAddress,r=n.selectedAddress;Object(l.a)(r,e)||a(e)},t.handleUseNewAddress=function(){var e=t.props,n=e.selectedAddress;(0,e.onUseNewAddress)(n)},t}return Object(a.__extends)(t,e),t.prototype.render=function(){var e=this.props,t=e.addresses,n=e.selectedAddress;return o.a.createElement("div",{className:"form-field"},o.a.createElement("div",{className:"dropdown--select",role:"combobox"},o.a.createElement(c.a,{dropdown:o.a.createElement(m,{addresses:t,onSelectAddress:this.handleSelectAddress,onUseNewAddress:this.handleUseNewAddress,selectedAddress:n})},o.a.createElement(p,{addresses:t,selectedAddress:n}))))},t}(r.PureComponent),m=function(e){var t=e.addresses,n=e.onSelectAddress,a=e.onUseNewAddress,r=e.selectedAddress;return o.a.createElement("ul",{className:"dropdown-menu instrumentSelect-dropdownMenu",id:"addressDropdown"},o.a.createElement("li",{className:"dropdown-menu-item dropdown-menu-item--select"},o.a.createElement("a",{"data-test":"add-new-address",href:"#",onClick:Object(s.a)((function(){return a(r)}))},o.a.createElement(i.a,{id:"address.enter_address_action"}))),t.map((function(e){return o.a.createElement("li",{className:"dropdown-menu-item dropdown-menu-item--select",key:e.id},o.a.createElement("a",{href:"#",onClick:Object(s.a)((function(){return n(e)}))},o.a.createElement(d.a,{address:e})))})))},p=function(e){var t=e.selectedAddress;return o.a.createElement("a",{className:"button dropdown-button dropdown-toggle--select",href:"#",id:"addressToggle",onClick:Object(s.a)()},t?o.a.createElement(d.a,{address:t}):o.a.createElement(i.a,{id:"address.enter_address_action"}))};t.a=Object(r.memo)(u)},1875:function(e,t,n){"use strict";var a=n(2),r=n(0),o=n.n(r),s=n(560),i=n(562),c=n(1693),l=n(1722),d=n(1721),u=n(1694);t.a=function(){var e=Object(r.useCallback)((function(e){return o.a.createElement(i.a,{hidden:!0,htmlFor:e},o.a.createElement(s.a,{id:"shipping.order_comment_label"}))}),[]),t=Object(r.useCallback)((function(e){var t=e.field;return o.a.createElement(c.a,Object(a.__assign)({},t,{autoComplete:"off",maxLength:2e3}))}),[]),n=Object(r.useMemo)((function(){return o.a.createElement(l.a,null,o.a.createElement(s.a,{id:"shipping.order_comment_label"}))}),[]);return o.a.createElement(d.a,{legend:n,testId:"checkout-shipping-comments"},o.a.createElement(u.a,{input:t,label:e,name:"orderComment"}))}},1876:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(842),r=n(1720);function o(e){return(e&&e.payments?e.payments:[]).find((function(e){return!Object(a.a)(e)&&!Object(r.a)(e)&&!!e.providerId}))}},1895:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n(10),o=n(0),s=n.n(o),i=n(1863),c=n(1748),l=n(559),d=n(1686),u=n(560),m=n(1781),p=n(1722),h=n(1714),f=n(1876);function g(e){var t=Object(f.a)(e);return t&&["amazonpay"].indexOf(t.providerId)>-1?t.providerId:void 0}var b=n(144),v=n(89),_=n(1864),C=n(1865),O=n(1845),y=n(840),j=n(828),E=n(839),S=n(393),A=n(1875),k=n(1713),w=n(1723),N=n(1721),P=n(1699),I=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={isResettingAddress:!1},t.addressFormRef=Object(o.createRef)(),t.handleSelectAddress=function(e){return Object(a.__awaiter)(t,void 0,void 0,(function(){var t,n,r,o;return Object(a.__generator)(this,(function(a){switch(a.label){case 0:t=this.props,n=t.updateAddress,r=t.onUnhandledError,this.setState({isResettingAddress:!0}),a.label=1;case 1:return a.trys.push([1,3,4,5]),[4,n(e)];case 2:return a.sent(),[3,5];case 3:return o=a.sent(),r(o),[3,5];case 4:return this.setState({isResettingAddress:!1}),[7];case 5:return[2]}}))}))},t.handleUseNewAddress=function(){t.handleSelectAddress({})},t}return Object(a.__extends)(t,e),t.prototype.render=function(){var e=this.props,t=e.googleMapsApiKey,n=e.billingAddress,a=e.countriesWithAutocomplete,r=e.customer,o=r.addresses,i=r.isGuest,c=e.getFields,l=e.countries,d=e.isUpdating,m=e.setFieldValue,p=e.shouldShowOrderComments,f=e.values,g="amazonpay"===e.methodId,b=c(f.countryCode),v=b.filter((function(e){return e.custom})),y=v.length>0,j=g&&y?v:b,E=this.state.isResettingAddress,S=o&&o.length>0,I=n&&Object(_.a)(n,o,c(n.countryCode));return s.a.createElement(w.a,{autoComplete:"on"},g&&n&&s.a.createElement("div",{className:"form-fieldset"},s.a.createElement(P.a,{address:n})),s.a.createElement(N.a,{id:"checkoutBillingAddress",ref:this.addressFormRef},S&&!g&&s.a.createElement(N.a,{id:"billingAddresses"},s.a.createElement(h.a,{isLoading:E},s.a.createElement(C.a,{addresses:o,onSelectAddress:this.handleSelectAddress,onUseNewAddress:this.handleUseNewAddress,selectedAddress:I?n:void 0}))),!I&&s.a.createElement(h.a,{isLoading:E},s.a.createElement(O.a,{countries:l,countriesWithAutocomplete:a,countryCode:f.countryCode,formFields:j,googleMapsApiKey:t,setFieldValue:m,shouldShowSaveAddress:!i}))),p&&s.a.createElement(A.a,null),s.a.createElement("div",{className:"form-actions"},s.a.createElement(k.c,{disabled:d||E,id:"checkout-billing-continue",isLoading:d||E,type:"submit",variant:k.b.Primary},s.a.createElement(u.a,{id:"common.continue_action"}))))},t}(o.PureComponent),x=Object(S.a)(Object(b.withFormik)({handleSubmit:function(e,t){(0,t.props.onSubmit)(e)},mapPropsToValues:function(e){var t=e.getFields,n=e.customerMessage,r=e.billingAddress;return Object(a.__assign)(Object(a.__assign)({},Object(y.a)(t(r&&r.countryCode),r)),{orderComment:n})},isInitialValid:function(e){var t=e.billingAddress,n=e.getFields,a=e.language;return!!t&&Object(j.a)({language:a,formFields:n(t.countryCode)}).isValidSync(t)},validationSchema:function(e){var t=e.language,n=e.getFields;return"amazonpay"===e.methodId?Object(v.lazy)((function(e){return Object(E.a)({translate:Object(j.b)(t),formFields:n(e&&e.countryCode)})})):Object(v.lazy)((function(e){return Object(j.a)({language:t,formFields:n(e&&e.countryCode)})}))},enableReinitialize:!0})(I)),F=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.handleSubmit=function(e){return Object(a.__awaiter)(t,void 0,void 0,(function(){var t,n,r,o,s,l,d,u,m,p,h=e.orderComment,f=Object(a.__rest)(e,["orderComment"]);return Object(a.__generator)(this,(function(e){switch(e.label){case 0:t=this.props,n=t.updateAddress,r=t.updateCheckout,o=t.customerMessage,s=t.billingAddress,l=t.navigateNextStep,d=t.onUnhandledError,u=[],(m=Object(i.a)(f))&&!Object(c.a)(m,s)&&u.push(n(m)),o!==h&&u.push(r({customerMessage:h})),e.label=1;case 1:return e.trys.push([1,3,,4]),[4,Promise.all(u)];case 2:return e.sent(),l(),[3,4];case 3:return p=e.sent(),d(p),[3,4];case 4:return[2]}}))}))},t}return Object(a.__extends)(t,e),t.prototype.componentDidMount=function(){return Object(a.__awaiter)(this,void 0,void 0,(function(){var e,t,n,o,s,i;return Object(a.__generator)(this,(function(a){switch(a.label){case 0:e=this.props,t=e.initialize,n=e.onReady,o=void 0===n?r.noop:n,s=e.onUnhandledError,a.label=1;case 1:return a.trys.push([1,3,,4]),[4,t()];case 2:return a.sent(),o(),[3,4];case 3:return i=a.sent(),s(i),[3,4];case 4:return[2]}}))}))},t.prototype.render=function(){var e=this.props,t=e.updateAddress,n=e.isInitializing,r=Object(a.__rest)(e,["updateAddress","isInitializing"]);return s.a.createElement("div",{className:"checkout-form"},s.a.createElement("div",{className:"form-legend-container"},s.a.createElement(p.a,{testId:"billing-address-heading"},s.a.createElement(u.a,{id:"billing.billing_address_heading"}))),s.a.createElement(h.a,{isLoading:n,unmountContentWhenLoading:!0},s.a.createElement(x,Object(a.__assign)({},r,{onSubmit:this.handleSubmit,updateAddress:t}))))},t}(o.Component);t.default=Object(l.a)((function(e){var t=e.checkoutService,n=e.checkoutState,a=n.data,r=a.getCheckout,o=a.getConfig,s=a.getCart,i=a.getCustomer,c=a.getBillingAddress,l=a.getBillingAddressFields,u=a.getBillingCountries,p=n.statuses,h=p.isLoadingBillingCountries,f=p.isUpdatingBillingAddress,b=p.isUpdatingCheckout,v=o(),_=i(),C=r(),O=s();if(!(v&&_&&C&&O))return null;var y=v.checkoutSettings,j=y.enableOrderComments,E=y.googleMapsApiKey,S=["US","CA","AU","NZ"];return y.features["CHECKOUT-4183.checkout_google_address_autocomplete_uk"]&&S.push("GB"),{billingAddress:c(),countries:u()||d.a,countriesWithAutocomplete:S,customer:_,customerMessage:C.customerMessage,getFields:l,googleMapsApiKey:E,initialize:t.loadBillingAddressFields,isInitializing:h(),isUpdating:f()||b(),methodId:g(C),shouldShowOrderComments:j&&Object(m.a)(O)<1,updateAddress:t.updateBillingAddress,updateCheckout:t.updateCheckout}}))(F)}}]);
//# sourceMappingURL=billing-f3951ae3.js.map