$(document).ready(function () {
  let currentDialog;

  // When no dialogs are up, prevents default click-event
  function preventDefault(e) {
    inputDialogShowing = $('#custom-input').is(':visible')
    alertDialogShowing = $('#custom-alert').is(':visible')
    if (!inputDialogShowing && !alertDialogShowing) {
      e.stopPropagation();
    }
  }

  function deselectCurrentNode() {
    $(".node.selected").removeClass("selected");
  }

  function createNewNode(parentNode, text) {
    const newNode = $("<li><span class='node'>" + text + "</span></li>");
    const ul = parentNode.parent().children("ul");
    // If the parent does not have children, create UL
    if (ul.length === 0) {
      parentNode.parent().append("<ul></ul>");
    }
    // Append the new node to the parent's UL
    parentNode.parent().children("ul").append(newNode);
  }

  function editNode(editingNode, text) {
    editingNode.text(text);
  }

  // Default click event 
  $(".main-content, .button-bar").click(function () {
    deselectCurrentNode();
    hideAlertDialog();
    hideInputDialog();
  });

  // Node click event
  $(".node").click(function (e) {
    preventDefault(e);
    // Deselect old node
    deselectCurrentNode();
    // Select clicked node
    $(this).addClass("selected");
  });

  // Add node click event
  $("#add-node").click(function (e) {
    preventDefault(e);
    // Check if there is selected node
    const parentNode = $(".selected");
    if (parentNode.length > 0) {
      currentDialog = "create";
      showInputDialog("New element's content:");
    } else {
      showAlertDialog("Please select the new node's parent.");
    }
  });

  // Edit node click event
  $("#edit-node").click(function (e) {
    preventDefault(e);
    // Check if there is selected node
    const editingNode = $(".selected");
    if (editingNode.length > 0) {
      currentDialog = "edit";
      showInputDialog("Edit the element's content:", editingNode.text());
    } else {
      showAlertDialog("Please select a node to edit.");
    }
  });

  // Remove node click event
  $("#remove-node").click(function (e) {
    preventDefault(e);
    // Check if there is selected node
    const deletingNode = $(".selected");
    if (deletingNode.length > 0) {
      if (!deletingNode.hasClass("root")) {
        deletingNode.parent().remove();
      } else {
        showAlertDialog("Can't remove the root node.");
      }
    } else {
      showAlertDialog("Please select a node to remove.");
    }
  });

  function showInputDialog(promptText, nodeText="") {
    $("#input-prompt").text(promptText);
    $("#input-text").val(nodeText);
    $("#custom-input").show();
  }

  function hideInputDialog() {
    $("#custom-input").hide();
  }

  function showAlertDialog(promptText) {
    $("#alert-prompt").text(promptText);
    $("#custom-alert").show();
  }

  function hideAlertDialog() {
    $("#custom-alert").hide();
  }

  $("#submit-input").click(function () {
    const userInput = $("#input-text").val();
    const selectedNode = $(".selected");
    if (userInput !== null && userInput.trim() !== "" && selectedNode.length > 0) {
      if (currentDialog == "create") {
        createNewNode(selectedNode, userInput);
      } else {
        editNode(selectedNode, userInput);
      }
      hideInputDialog();
    }
  });

  $("#cancel-input").click(function () {
    hideInputDialog();
  });
});