$(document).ready(function () {
  // Default click event deselects any node
  $(document).click(function(event) {
    $(".context-menu.selected").removeClass("selected");
  });
  
  // Click event on nodes
  $(".context-menu").click(function (e) {
    // Deselect old node
    $(".context-menu.selected").removeClass("selected");
    // Select clicked node
    $(this).addClass("selected");
    // Prevent deselect clicked node (from default click event)
    e.stopPropagation();
  });

  // Add Node Button Click Event
  $("#add-node").click(function () {
    const selectedNode = $(".selected");

    // Check if a node is selected
    if (selectedNode.length > 0) {
      const newNodeText = prompt("Enter the text for the new node:");
      if (newNodeText !== null) {
        const newNode = $("<li><span class='context-menu'>" + newNodeText + "</span></li>");
        const ul = selectedNode.children("ul");

        // If the selected node doesn't have a nested UL, create one
        if (ul.length === 0) {
          selectedNode.append("<ul></ul>");
        }

        // Append the new node to the selected node's UL
        selectedNode.children("ul").append(newNode);
      }
    } else {
      alert("Please select a node before adding a new one.");
    }
  });

  // Remove Node Button Click Event
  $("#remove-node").click(function () {
    const selectedNode = $(".selected");

    // Check if a node is selected
    if (selectedNode.length > 0) {
      if(!selectedNode.hasClass("root")) {
        selectedNode.parent().remove();
      } else {
        alert("Can't remove the root node.");
        e.stopPropagation();
      }
    } else {
      alert("Please select a node to remove.");
    }
  });

  // Edit Node Button Click Event
  $("#edit-node").click(function () {
    const selectedNode = $(".selected");

    // Check if a node is selected
    if (selectedNode.length > 0) {
      const newText = prompt("Edit the text for the selected node:", selectedNode.text());
      if (newText !== null) {
        selectedNode.text(newText);
      }
    } else {
      alert("Please select a node to edit.");
    }
  });
});

