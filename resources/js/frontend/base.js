function Class(){}function capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}function isNumeric(e){return!isNaN(parseFloat(e))&&isFinite(e)}Class.prototype.construct=function(){},Class.__asMethod__=function(e,t){return function(){var i=this.$;this.$=t;var n=e.apply(this,arguments);return this.$=i,n}},Class.extend=function(e){var t=function(){arguments[0]!==Class&&this.construct.apply(this,arguments)},i=new this(Class),n=this.prototype;for(var a in e){var s=e[a];s instanceof Function&&(s=Class.__asMethod__(s,n)),i[a]=s}return i.$=n,t.prototype=i,t.extend=this.extend,t},$.fn.highlight=function(e){function t(e,i){var n=0;if(3==e.nodeType){var a=e.data.toUpperCase().indexOf(i);if((a-=e.data.substr(0,a).toUpperCase().length-e.data.substr(0,a).length)>=0){var s=document.createElement("span");s.className="highlight";var r=e.splitText(a);r.splitText(i.length);var o=r.cloneNode(!0);s.appendChild(o),r.parentNode.replaceChild(s,r),n=1}}else if(1==e.nodeType&&e.childNodes&&!/(script|style)/i.test(e.tagName))for(var l=0;l<e.childNodes.length;++l)l+=t(e.childNodes[l],i);return n}return this.length&&e&&e.length?this.each(function(){t(this,e.toUpperCase())}):this},$.fn.searchAble=function(e){var t="",i="",n=this,a=n.next(".glyphicon-remove");a.click(function(){n.val(""),n.trigger("keyup")}),n.on("keyup",function(s){var r=n.val();if(""==r?a.hide():a.show(),s.keyCode==keyCode.ENTER)return i=r,void e(r);t=r,setTimeout(function(){r==t&&r!=i&&(i=r,e(r))},500)})},$.fn.serializeObject=function(){var e={},t=this.serializeArray();return $.each(t,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e};var keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38,SHIFT:16,S:83},KikCmsClass=Class.extend({baseUri:null,translations:{},errorMessages:{},isDev:!1,maxFileUploads:null,maxFileSize:null,maxFileSizeString:null,renderables:{},init:function(){"undefined"!=typeof moment&&moment.locale($("html").attr("lang"));var e=JSON.parse($("#kikCmsJsSettings").val());for(var t in e)this[t]=e[t]},initRenderables:function(e){var t=this;e=void 0!==e?e:null,$("[data-renderable]").each(function(){var i=$(this);if("true"!=i.attr("data-rendered")){var n=$.parseJSON(i.attr("data-renderable")),a=n.properties.renderableInstance;t.renderables[a]=new window[n.class],$.each(n.properties,function(e,i){t.renderables[a][e]=i}),e&&(t.renderables[a].parent=e),t.renderables[a].init(),i.attr("data-rendered",!0)}})},action:function(e,t,i,n,a,s){var r=!1,o=this,l=0;s=void 0!==s?s:null,setTimeout(function(){0==r&&KikCMS.showLoader()},250);var d=$("html").attr("lang");d&&(t.activeLangCode=d);var c={url:e,type:"post",dataType:"json",data:t,cache:!1,success:function(e,t,n){r=!0,o.hideLoader(),i(e,t,n),o.initRenderables(s)},error:function(e){if(0==e.readyState&&0==e.status&&l<2)return l++,void u();r=!0,o.showError(e,n)}};void 0!==a&&a&&(c.cache=!1,c.contentType=!1,c.processData=!1,c.xhr=a);var u=function(){$.ajax(c)};u()},showError:function(e,t){void 0!==t&&t(),this.hideLoader();var i=this.translations["error."+e.status+".title"]?e.status:"unknown";this.isDev&&440!=e.status?$("#ajaxDebugger").html(e.responseText).show():alert(this.translations["error."+i+".title"]+"\n\n"+this.translations["error."+i+".description"])},showLoader:function(){this.getLoader().addClass("show")},hideLoader:function(){this.getLoader().removeClass("show")},getLoader:function(){return $("#cmsLoader")},removeExtension:function(e){return e.replace(/\.[^\/.]+$/,"")},tl:function(e,t){var i=this.translations[e];return $.each(t,function(e,t){i=i.replace(new RegExp(":"+e,"g"),t)}),i},toSlug:function(e){e=e.replace(/^\s+|\s+$/g,"").toLowerCase();for(var t="àáäâèéëêìíïîòóöôùúüûñç·/_,:;",i="aaaaeeeeiiiioooouuuunc------",n=0,a=t.length;n<a;n++)e=e.replace(new RegExp(t.charAt(n),"g"),i.charAt(n));return e=e.replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}}),KikCMS=new KikCmsClass;$(function(){KikCMS.init(),KikCMS.initRenderables()});var WebForm=Class.extend({renderableInstance:null,renderableClass:null,parent:null,actionGetFinder:function(e){var t=this,i=e.find(".file-picker"),n=e.find(".btn.upload"),a=i.find(".pick-file");KikCMS.action("/cms/webform/getFinder",{},function(s){i.find(".finder-container").html(s.finder),i.slideDown(),i.on("pick",".file",function(){var s=$(this),r=s.attr("data-id");t.actionPickFile(e,r),i.slideUp(function(){s.removeClass("selected"),a.addClass("disabled")}),n.removeClass("disabled")}),i.on("selectionChange",".file",function(){i.find(".file.selected:not(.folder)").length>=1?a.removeClass("disabled"):a.addClass("disabled")}),a.click(function(){if(!a.hasClass("disabled")){var s=i.find(".file.selected"),r=s.attr("data-id");t.actionPickFile(e,r),i.slideUp(function(){s.removeClass("selected"),a.addClass("disabled")}),n.removeClass("disabled")}}),n.addClass("disabled")})},actionPreview:function(e,t,i){var n=e.find(".preview"),a=e.find(".preview .thumb"),s=e.find(".buttons .pick"),r=e.find(".buttons .delete");i.dimensions?(a.css("width",i.dimensions[0]/2),a.css("height",i.dimensions[1]/2)):(a.css("width","auto"),a.css("height","auto")),n.removeClass("hidden"),a.html(i.preview),e.find(" > input[type=hidden].fileId").val(t),s.addClass("hidden"),r.removeClass("hidden")},actionPickFile:function(e,t){var i=this;KikCMS.action("/cms/webform/getFilePreview",{fileId:t},function(n){i.actionPreview(e,t,n)})},getWebForm:function(){return $("#"+this.renderableInstance)},init:function(){this.initAutocompleteFields(),this.initDateFields(),this.initFileFields(),this.initWysiwyg(),this.initPopovers()},initAutocompleteFields:function(){var e=this;this.getWebForm().find(".autocomplete").each(function(){var t=$(this),i=t.attr("data-field-key"),n=t.attr("data-route");KikCMS.action(n,{field:i,renderableInstance:e.renderableInstance,renderableClass:e.renderableClass},function(e){t.typeahead({items:10,source:e})})})},initDateFields:function(){this.getWebForm().find(".type-date input").each(function(){var e=$(this);e.datetimepicker({format:e.attr("data-format"),locale:moment.locale()})})},initFileFields:function(){var e=this;this.getWebForm().find(".type-file").each(function(){var t=$(this),i=t.find(".file-picker"),n=t.find(".btn.upload"),a=t.find(".btn.delete"),s=t.find(".btn.pick"),r=t.find(".btn.preview"),o=t.find(".btn.pick, .btn.preview");e.initUploader(t),i.find(".buttons .cancel").click(function(){i.slideUp(),n.removeClass("disabled")}),a.click(function(){t.find(" > input[type=hidden].fileId").val(""),s.removeClass("hidden"),a.addClass("hidden"),r.find("img").remove(),r.addClass("hidden")}),o.click(function(){if(0!=$(this).attr("data-finder"))return i.find(".finder").length>=1?(i.slideToggle(),void n.toggleClass("disabled")):void e.actionGetFinder(t)})})},initPopovers:function(){this.getWebForm().find('[data-toggle="popover"]').each(function(){var e=$(this).attr("data-content");$(this).popover({placement:"auto bottom",html:!0,content:e,container:"body"})})},initTinyMCE:function(){var e=this;tinymce.init({selector:this.getWysiwygSelector(),setup:function(e){e.on("change",function(){tinymce.triggerSave()})},language_url:"/cmsassets/js/tinymce/"+KikCMS.tl("system.langCode")+".js",language:KikCMS.tl("system.langCode"),theme:"modern",relative_urls:!1,remove_script_host:!0,document_base_url:KikCMS.baseUri,plugins:["advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace visualblocks","visualchars code insertdatetime media nonbreaking save table contextmenu directionality template paste","textcolor colorpicker textpattern codesample toc"],toolbar1:"undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor | codesample",image_advtab:!0,content_css:["/cmsassets/css/tinymce/content.css"],link_list:this.getLinkListUrl(),file_picker_callback:function(t){e.getFilePicker(t)}})},initUploader:function(e){var t=this;new FinderFileUploader({$container:e,action:"/cms/webform/uploadAndPreview",addParametersBeforeUpload:function(i){return i.append("folderId",e.find(".btn.upload").attr("data-folder-id")),i.append("renderableInstance",t.renderableInstance),i.append("renderableClass",t.renderableClass),i},onSuccess:function(i){i.fileId&&t.actionPreview(e,i.fileId,i)}}).init()},initWysiwyg:function(){var e=this;0!=$(this.getWysiwygSelector()).length&&("undefined"==typeof tinymce?$.getScript("//cdn.tinymce.com/4/tinymce.min.js",function(){window.tinymce.dom.Event.domLoaded=!0,tinymce.baseURL="//cdn.tinymce.com/4",tinymce.suffix=".min",e.initTinyMCE()}):this.initTinyMCE())},getFilePicker:function(e){var t=function(t){var n=t.attr("data-id");e("/finder/file/"+n,{text:t.find(".name span").text()}),i.close()},i=tinymce.activeEditor.windowManager.open({title:"Image Picker",url:"/cms/filePicker",width:952,height:768,buttons:[{text:"Insert",onclick:function(){var e=$(i.$el).find("iframe")[0].contentWindow.$(".filePicker"),n=e.find(".file.selected");if(!n.length)return!1;t(n)}},{text:"Close",onclick:"close"}]});i.on("open",function(){$(i.$el).find("iframe").on("load",function(){this.contentWindow.$(".filePicker").on("pick",".file",function(){t($(this))})})})},getLinkListUrl:function(){return this.parent&&this.parent.getWindowLanguageCode()?"/cms/getTinyMceLinks/"+this.parent.getWindowLanguageCode()+"/":"/cms/getTinyMceLinks/"},getWysiwygSelector:function(){return"#"+this.getWebForm().attr("id")+" textarea.wysiwyg"},removeExtension:function(e){return e.replace(/\.[^\/.]+$/,"")},tl:function(e,t){var i=this.translations[e];return $.each(t,function(e,t){i=i.replace(new RegExp(":"+e,"g"),t)}),i}});