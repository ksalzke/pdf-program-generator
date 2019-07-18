let margin = 25;

var doc = new PDFDocument({
  size: "A5",
  margin: margin
});
var stream = doc.pipe(blobStream());

let columnWidth = (doc.page.width - margin * 2) / 3;

for (let i = 0; i < concertData.performances.length; i++) {
  let performance = concertData.performances[i];

  doc.x = margin;
  doc.fontSize(11).text(performance.student, {
    width: columnWidth
  });
  doc.x = margin + columnWidth;
  doc.moveUp().text(performance.piece, {
    align: "center",
    width: columnWidth
  });
  doc.x = margin + columnWidth * 2;
  doc.moveUp().text(performance.composer, {
    align: "right",
    width: columnWidth
  });
  doc.x = margin;
  doc.fontSize(8).text("Accomp: " + performance.accompanist, {
    width: columnWidth
  });
  doc.x = margin + columnWidth;
  doc.moveUp().text(performance.instrument, {
    align: "center",
    width: columnWidth
  });
  doc.x = margin + columnWidth * 2;
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
