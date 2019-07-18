let margin = 25;

var doc = new PDFDocument({
  size: "A5",
  margin: margin
});
var stream = doc.pipe(blobStream());

let columnWidth = (doc.page.width - margin * 2) / 3;

function getHeightOfString(item) {
  return doc.heightOfString(item[0], item[1]);
}

function getMaximumHeight(item1, item2, item3) {
  let item1Height = getHeightOfString(item1);
  let item2Height = getHeightOfString(item2);
  let item3Height = getHeightOfString(item3);
  return Math.max(item1Height, item2Height, item3Height);
}

function getYOffset(currentItemHeight, maximumHeight) {
  if (currentItemHeight == maximumHeight) {
    return 0;
  } else {
    return (maximumHeight - currentItemHeight) / 2;
  }
}

for (let i = 0; i < concertData.performances.length; i++) {
  let performance = concertData.performances[i];

  let currentYCoord = doc.y;

  let studentText = [
    performance.student,
    {
      width: columnWidth
    }
  ];
  let pieceText = [
    performance.piece,
    {
      align: "center",
      width: columnWidth
    }
  ];
  let composerText = [
    performance.composer,
    {
      align: "right",
      width: columnWidth
    }
  ];

  let maximumHeight = getMaximumHeight(studentText, pieceText, composerText);

  let studentOffset = getYOffset(getHeightOfString(studentText), maximumHeight);
  doc.y = doc.y + studentOffset;
  doc.x = margin;
  doc.fontSize(11).text(studentText[0], studentText[1]);
  let yAfterStudent = doc.y;

  let pieceOffset = getYOffset(getHeightOfString(pieceText), maximumHeight);
  doc.x = margin + columnWidth;
  doc.y = currentYCoord + pieceOffset;
  doc.text(pieceText[0], pieceText[1]);
  let yAfterPiece = doc.y;

  let composerOffset = getYOffset(
    getHeightOfString(composerText),
    maximumHeight
  );
  doc.x = margin + columnWidth * 2;
  doc.y = currentYCoord + composerOffset;
  doc.text(composerText[0], composerText[1]);
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
