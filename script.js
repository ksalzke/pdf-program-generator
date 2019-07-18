let margin = 25;

var doc = new PDFDocument({
  size: "A5",
  margin: margin
});
var stream = doc.pipe(blobStream());

let columnWidth = (doc.page.width - margin * 2) / 3;

for (let i = 0; i < concertData.performances.length; i++) {
  let performance = concertData.performances[i];

  var currentYCoord = doc.y;

  doc.x = margin;
  doc.fontSize(11).text(performance.student, {
    width: columnWidth
  });
  let yAfterStudent = doc.moveDown().y;
  doc.x = margin + columnWidth;
  doc.y = currentYCoord;
  doc.text(performance.piece, {
    align: "center",
    width: columnWidth
  });
  let yAfterPiece = doc.moveDown().y;
  doc.x = margin + columnWidth * 2;
  doc.y = currentYCoord;
  doc.text(performance.composer, {
    align: "right",
    width: columnWidth
  });

  let yAfterComposer = doc.moveDown().y;

  //set y coordinates for 2nd row based on longest part of 1st row
  currentYCoord = Math.max(yAfterStudent, yAfterPiece, yAfterComposer);

  doc.x = margin;
  doc.y = currentYCoord;
  doc.fontSize(8).text("Accomp: " + performance.accompanist, {
    width: columnWidth
  });
  doc.x = margin + columnWidth;
  // doc.y = currentYCoord;
  doc.moveUp().text(performance.instrument, {
    align: "center",
    width: columnWidth
  });
  doc.x = margin + columnWidth * 2;
  // doc.y = currentYCoord;
  doc.moveUp().text("Arr: " + performance.arranger, {
    align: "right",
    width: columnWidth
  });
  doc.moveDown(3);
}

// end and display the document in the iframe to the right
doc.end();

var saveData = (function() {
  var a = document.createElement("a");
  console.log(document);
  $("body").append(a);
  a.style = "display: none";
  return function(blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    // a.click();
    $("iframe").prop("src", url);
    window.URL.revokeObjectURL(url);
  };
})();

stream.on("finish", function() {
  var blob = stream.toBlob("application/pdf");
  saveData(blob, "aa.pdf");
});
