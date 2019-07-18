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
  let yAfterStudent = doc.y;
  doc.x = margin + columnWidth;
  doc.y = currentYCoord;
  doc.text(performance.piece, {
    align: "center",
    width: columnWidth
  });
  let yAfterPiece = doc.y;
  doc.x = margin + columnWidth * 2;
  doc.y = currentYCoord;
  doc.text(performance.composer, {
    align: "right",
    width: columnWidth
  });

  let yAfterComposer = doc.y;

  doc.x = margin;
  doc.y = yAfterStudent;
  doc.fontSize(8).text("Accomp: " + performance.accompanist, {
    width: columnWidth
  });
  let yAfterAccompanist = doc.y;

  doc.x = margin + columnWidth;
  doc.y = yAfterPiece;
  doc.text(performance.instrument, {
    align: "center",
    width: columnWidth
  });
  let yAfterInstrument = doc.y;

  doc.x = margin + columnWidth * 2;
  doc.y = yAfterComposer;
  doc.text("Arr: " + performance.arranger, {
    align: "right",
    width: columnWidth
  });
  let yAfterArranger = doc.y;

  //set y coordinates for next row based on longest part of this row
  doc.y = Math.max(yAfterAccompanist, yAfterInstrument, yAfterArranger);
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
