define(function(require, exports, module) {

    "use strict";
    
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var EditorManager = brackets.getModule("editor/EditorManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    
    var $statusBar;
    $statusBar = $("<span class='currentfunction-label' />");
    $statusBar.appendTo("#status-info");


	function writeStatus(statusMessage, extraMessage=""){
		$statusBar.text(" - " + statusMessage);
		$statusBar.attr("title", extraMessage);
	}
	
	function getPosition(Editor){
		var pos = Editor.getCursorPos();
		return pos;
	}
	
	function cursorHandler(BracketsEvent, Editor, KeyboardEvent) {
		var pos = getPosition(Editor);
		var found = false;
		
		if(pos.line>1){
			var funcName="";
			for(var x=pos.line;x>=0;x--){
				if(funcName = Editor.document.getLine(x).match(/function [a-zA-z]+\(.*?\)/)){
					found=true;
					writeStatus(funcName[0].replace("function",""));
					break;
				}
			}
		}
		
		if(!found){
			writeStatus("");
		}
		
		return;
	}

	EditorManager.on('activeEditorChange', function (e, editorGainingFocus, editorLosingFocus) {
		if (editorLosingFocus) {
			editorLosingFocus.off('cursorActivity', cursorHandler);
		}
		if (editorGainingFocus) {
			editorGainingFocus.on('cursorActivity', cursorHandler);
		}
	});
    
    //ExtensionUtils.addEmbeddedStyleSheet("#status-info .currentfunction-label { color: #aaa; }" + "body.dark #status-info .currentfunction-label { color: #9a9a9a; }");
    
});