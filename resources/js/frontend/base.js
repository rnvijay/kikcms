function Class(){}function capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}function isNumeric(e){return!isNaN(parseFloat(e))&&isFinite(e)}Class.prototype.construct=function(){},Class.__asMethod__=function(i,n){return function(){var e=this.$;this.$=n;var t=i.apply(this,arguments);return this.$=e,t}},Class.extend=function(e){var t=function(){arguments[0]!==Class&&this.construct.apply(this,arguments)},i=new this(Class),n=this.prototype;for(var a in e){var r=e[a];r instanceof Function&&(r=Class.__asMethod__(r,n)),i[a]=r}return i.$=n,t.prototype=i,t.extend=this.extend,t},$.fn.highlight=function(e){return this.length&&e&&e.length?this.each(function(){!function e(t,i){var n=0;if(3==t.nodeType){var a=t.data.toUpperCase().indexOf(i);if(0<=(a-=t.data.substr(0,a).toUpperCase().length-t.data.substr(0,a).length)){var r=document.createElement("span");r.className="highlight";var s=t.splitText(a);s.splitText(i.length);var o=s.cloneNode(!0);r.appendChild(o),s.parentNode.replaceChild(r,s),n=1}}else if(1==t.nodeType&&t.childNodes&&!/(script|style)/i.test(t.tagName))for(var l=0;l<t.childNodes.length;++l)l+=e(t.childNodes[l],i);return n}(this,e.toUpperCase())}):this},$.fn.searchAble=function(i){var n="",a="",r=this,s=r.next(".glyphicon-remove");s.click(function(){r.val(""),r.trigger("keyup")}),r.on("keyup",function(e){var t=r.val();""==t?s.hide():s.show(),e.keyCode!=keyCode.ENTER?(n=t,setTimeout(function(){t==n&&t!=a&&i(a=t)},500)):i(a=t)})},$.fn.serializeObject=function(){var e={},t=this.serializeArray();return $.each(t,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e};var keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38,SHIFT:16,S:83},KikCmsClass=Class.extend({baseUri:null,translations:{},errorMessages:{},isDev:!1,maxFileUploads:null,maxFileSize:null,maxFileSizeString:null,windowManager:null,renderables:{},init:function(){"undefined"!=typeof moment&&moment.locale($("html").attr("lang"));var e=JSON.parse($("#kikCmsJsSettings").text());for(var t in e)this[t]=e[t];$("body").on("mouseover",".tt-suggestion",function(){$(".tt-suggestion").removeClass("tt-cursor"),$(this).addClass("tt-cursor")}),"undefined"!=typeof WindowManager&&(this.windowManager=new WindowManager)},initRenderables:function(n){var a=this;n=void 0!==n?n:null,$("[data-renderable]").each(function(){var e=$(this);if("true"!=e.attr("data-rendered")){var t=$.parseJSON(e.attr("data-renderable")),i=t.properties.renderableInstance;a.renderables[i]=new window[t.class],$.each(t.properties,function(e,t){a.renderables[i][e]=t}),n&&(a.renderables[i].parent=n),a.renderables[i].init(),e.attr("data-rendered",!0)}})},action:function(e,t,n,i,a,r){var s=!1,o=this,l=0;r=void 0!==r?r:null,setTimeout(function(){0==s&&KikCMS.showLoader()},250);var c=$("html").attr("lang");c&&(t.activeLangCode=c);var d={url:e,type:"post",dataType:"json",data:t,cache:!1,success:function(e,t,i){s=!0,o.hideLoader(),n(e,t,i),o.initRenderables(r)},error:function(e){if(0==e.readyState&&0==e.status&&l<2)return l++,void u();s=!0,o.showError(e,i)}};void 0!==a&&a&&(d.cache=!1,d.contentType=!1,d.processData=!1,d.xhr=a);var u=function(){$.ajax(d)};u()},getSecurityToken:function(t){KikCMS.action("/cms/generate-security-token",{},function(e){t(e)})},showError:function(e,t){void 0!==t&&t(),this.hideLoader(),this.isDev&&440!=e.status?$("#ajaxDebugger").html(e.responseText).show():alert(e.responseJSON.title+"\n\n"+e.responseJSON.description)},showLoader:function(){this.getLoader().addClass("show")},hideLoader:function(){this.getLoader().removeClass("show")},getLoader:function(){return $("#cmsLoader")},removeExtension:function(e){return e.replace(/\.[^/.]+$/,"")},tl:function(e,t){var i=this.translations[e];return $.each(t,function(e,t){i=i.replace(new RegExp(":"+e,"g"),t)}),i},toSlug:function(e){e=e.replace(/^\s+|\s+$/g,"").toLowerCase();for(var t="àáäâèéëêìíïîòóöôùúüûñç·/_,:;",i=0,n=t.length;i<n;i++)e=e.replace(new RegExp(t.charAt(i),"g"),"aaaaeeeeiiiioooouuuunc------".charAt(i));return e=e.replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}}),KikCMS=new KikCmsClass;$(function(){KikCMS.init(),KikCMS.initRenderables()});var WebForm=Class.extend({renderableInstance:null,renderableClass:null,parent:null,actionPreview:function(e,t,i,n){var a=e.find(".preview"),r=e.find(".preview .thumb"),s=e.find(".buttons .pick"),o=e.find(".buttons .delete"),l=e.find(".filename");i.dimensions?(r.css("width",i.dimensions[0]/2),r.css("height",i.dimensions[1]/2)):(r.css("width","auto"),r.css("height","auto")),a.removeClass("hidden"),r.html(i.preview),l.html("("+i.name+")"),e.find(" > input[type=hidden].fileId").val(t),s.addClass("hidden"),o.removeClass("hidden"),void 0!==n&&n()},createFilePicker:function(t){var i=this;return new FilePicker(this.renderableInstance,this.getWebForm(),function(e){i.onPickFile(e,t)})},init:function(){this.initAutocompleteFields(),this.initDateFields(),this.initFileFields(),this.initWysiwyg(),this.initPopovers()},initAutocompleteFields:function(){var a=this;this.getWebForm().find(".autocomplete").each(function(){var t=$(this),e=t.attr("data-field-key"),i=t.attr("data-route"),n={field:e,renderableInstance:a.renderableInstance,renderableClass:a.renderableClass};KikCMS.action(i,n,function(e){a.initAutocompleteData(e,t)})})},initAutocompleteData:function(e,t){var a;t.typeahead({hint:!0,highlight:!0},{limit:10,source:(a=e,function(e,t){var i=[],n=new RegExp(e,"i");$.each(a,function(e,t){n.test(t)&&i.push(t)}),t(i)})})},initDateFields:function(){this.getWebForm().find(".type-date input").each(function(){var e=$(this);if(e.datetimepicker({format:e.attr("data-format"),locale:moment.locale(),useCurrent:!1}),e.attr("data-default-date")){var t=e.val(),i=moment(e.attr("data-default-date"),e.attr("data-format"));e.datetimepicker("defaultDate",i),t||e.val("")}})},initFileFields:function(){var o=this;this.getWebForm().find(".type-file").each(function(){var e=$(this),t=e.find(".file-picker"),i=e.find(".btn.upload"),n=e.find(".btn.delete"),a=e.find(".btn.pick"),r=e.find(".btn.preview"),s=e.find(".btn.pick, .btn.preview");o.initUploader(e),n.click(function(){e.find(".filename").html(""),e.find(" > input[type=hidden].fileId").val(""),a.removeClass("hidden"),n.addClass("hidden"),r.find("img").remove(),r.addClass("hidden")}),s.click(function(){if(0!=$(this).attr("data-finder")){if(1<=t.find(".finder").length)return t.slideToggle(),void i.toggleClass("disabled");o.filePicker=o.createFilePicker(e),o.filePicker.open()}})})},initPopovers:function(){this.getWebForm().find('[data-toggle="popover"]').each(function(){var e=$(this).attr("data-content");$(this).popover({placement:"auto bottom",html:!0,content:e,container:"body"})})},initTinyMCE:function(){var t=this;tinymce.init({selector:this.getWysiwygSelector(),setup:function(e){e.on("change",function(){tinymce.triggerSave()})},language_url:"/cmsassets/tinymce/"+KikCMS.tl("system.langCode")+".js",language:KikCMS.tl("system.langCode"),theme:"modern",relative_urls:!1,remove_script_host:!0,document_base_url:KikCMS.baseUri,plugins:["advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace visualblocks","visualchars code insertdatetime media nonbreaking save table contextmenu directionality template paste","textcolor colorpicker textpattern codesample toc"],image_advtab:!0,content_css:["/cmsassets/css/tinymce_content.css"],link_list:this.getLinkListUrl(),file_picker_callback:function(e){t.getFilePicker(e)}})},initUploader:function(t){var i=this;new FileUploader({$container:t,action:"/cms/webform/uploadAndPreview",addParametersBeforeUpload:function(e){return e.append("folderId",t.find(".btn.upload").attr("data-folder-id")),e.append("renderableInstance",i.renderableInstance),e.append("renderableClass",i.renderableClass),e},onSuccess:function(e){e.fileId&&i.actionPreview(t,e.fileId,e)}}).init()},initWysiwyg:function(){var e=this;0!=$(this.getWysiwygSelector()).length&&("undefined"==typeof tinymce?$.getScript("//cdn.tinymce.com/4/tinymce.min.js",function(){window.tinymce.dom.Event.domLoaded=!0,tinymce.baseURL="//cdn.tinymce.com/4",tinymce.suffix=".min",e.initTinyMCE()}):this.initTinyMCE())},getFilePicker:function(i){var t=function(t){var e=t.attr("data-id");KikCMS.action("/cms/file/url/"+e,{},function(e){i(e.url,{alt:t.find(".name span").text()}),n.close()})},e=this.getWindowHeight()<768?this.getWindowHeight()-130:768,n=tinymce.activeEditor.windowManager.open({title:"Image Picker",url:"/cms/filePicker",width:952,height:e,buttons:[{text:"Insert",onclick:function(){var e=$(n.$el).find("iframe")[0].contentWindow.$(".filePicker").find(".file.selected");if(!e.length)return!1;t(e)}},{text:"Close",onclick:"close"}]});n.on("open",function(){$(n.$el).find("iframe").on("load",function(){this.contentWindow.$(".filePicker").on("pick",".file",function(){t($(this))})})})},getLinkListUrl:function(){var e="/cms/getTinyMceLinks/";return this.parent&&this.parent.getWindowLanguageCode()?e+this.parent.getWindowLanguageCode()+"/":e},getWebForm:function(){return $("[data-instance="+this.renderableInstance+"]")},getWindowHeight:function(){return $(window).height()},getWysiwygSelector:function(){return"#"+this.getWebForm().attr("id")+" textarea.wysiwyg"},getUploadButtonForFileField:function(e){return e.find(".btn.upload")},onPickFile:function(e,t){var i=this,n=e.attr("data-id"),a=this.getUploadButtonForFileField(t);e.removeClass("selected"),a.removeClass("disabled"),KikCMS.action("/cms/webform/filepreview/"+n,{},function(e){i.actionPreview(t,n,e)})},removeExtension:function(e){return e.replace(/\.[^/.]+$/,"")}});