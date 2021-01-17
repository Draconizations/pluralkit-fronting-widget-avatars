// ORIGINAL CODE BY VRISKA OF THE COLLECTIVE (ramblingArachnid#8781)
// AVATAR ADDITION BY PALS (PALS#1612)

//PLEASE INPUT YOUR SYSTEM ID BELOW, SURROUNDED BY DOUBLE QUOTES
const systemID = "bnynr";

//INCLUDE TOKEN BELOW (found by running pk;token) IF YOUR SYSTEM FRONT INFORMATION IS PRIVATE
//MAKE SURE IT IS SURROUNDED BY DOUBLE QUOTES
const token = "";

// Use Display Names
// set true if you would like to use display names instead of names where available. Set to false to only use names.
const useDisplayNames = true;

// Use First Fronter's Color as Widget Background Color
// set to false if you would like to use black/white as opposed to the first fronter's color for the widget.
const useFirstFronterColorAsBackgroundColor = false;

// Use member avatars
// set false to disable avatars
const useAvatar = true;

// WIDGET CUTOFF: only edit if necessary
// changes the amount of members visible on the widget before a "more..." gets added. to prevent overflow
// the small cutoff works for small and medium widgets, the large cutoff for the large widget
const smallWidgetCutoff = 3;
const largeWidgetCutoff = 10;

// FONT SIZES: only edit if necessary
const headerFontSize = 18;
const listFontSize = 18;
const moreFontSize = 16;

// AVATAR SIZE: only edit if necessary
const avatarSize = 24;

// AVATAR PLACEHOLDER: changes the default avatar used by members without an avatar set
const avatarPlaceholder = "https://i.imgur.com/Typ6jFE.png";

//default 'white' and 'black' colors
const white = new Color("ffffff");
const black = new Color("000000");

//widget heading - 'Fronters' by default
const heading = "FRONTING";

// fonts - leave "" for default system font.
// view font options at iosfonts.com
// copy-paste font name in between quotes
// for example, headerFontName = "Bradley Hand" or
// headerFontName = "Cochin-Italic"
const headerFontName = "";
const listFontName = "";
const moreFontName = "";

// DO NOT EDIT BELOW THIS UNLESS YOU KNOW WHAT YOU ARE DOING

var error = "";
var bgColor = white;
var textColor = black;

var imgSize = new Size(avatarSize, avatarSize);

var headerFont = Font.systemFont(headerFontSize);
var listFont = Font.systemFont(listFontSize);
var moreFont = Font.systemFont(moreFontSize);

if (headerFontName != "") {
  headerFont = new Font(headerFontName, headerFontSize);
}
if (listFontName != "") {
  listFont = new Font(listFontName, listFontSize);
}
if (moreFontName != "") {
  moreFont = new Font(moreFontName, moreFontSize);
}

list = [];
imglist = [];

const url = `https://api.pluralkit.me/v1/s/${systemID}/fronters`;

const req = new Request(url);
req.headers = { Authorization: token };

if (systemID == "") {
  error = "System not found.";
}

if (error == "") {
  const resString = await req.loadString();

  if (!resString || resString[0].charAt(0) != "{") {
    error = resString;
    if (resString == "Unauthorized to view fronter.") {
      error += " Please add token to script or set front privacy to public.";
    } else if (resString == "System not found.") {
      error +=
        " Please add system ID to script or double-check that you have added your ID correctly.";
    }
  }
}

if (error == "") {
  const res = await req.loadJSON();

  //set widget color to current fronter's color if wanted
  //widget text to either white or black to maintain contrast
  //if no color set for member, use system light/dark mode setting
  if (
    res.members.length > 0 &&
    useFirstFronterColorAsBackgroundColor &&
    res.members[0].color
  ) {
    memberColor = new Color(res.members[0].color);
    if (
      memberColor.red * 0.299 +
        memberColor.green * 0.587 +
        memberColor.blue * 0.114 <
      150
    ) {
      textColor = white;
    }
  } else {
    memberColor = Color.dynamic(white, black);
    textColor = Color.dynamic(black, white);
  }

  bgColor = memberColor;

  // loop through members, get displayname if available, else use name
  // get avatar image if available, else use a placeholder
  if (res.members.length == 0) {
    list.push("No fronter");
  }
  for (var i = 0; i < res.members.length; i++) {
    if (useDisplayNames && res.members[i].display_name) {
      list.push(res.members[i].display_name);
    } else {
      list.push(res.members[i].name);
    }

    if (useAvatar) {
      if (res.members[i].avatar_url) {
        let image = new Request(res.members[i].avatar_url);
        let img = await image.loadImage();
        imglist.push(img);
      } else {
        let image = new Request(avatarPlaceholder);
        let img = await image.loadImage();
        imglist.push(img);
      }
    }
  }
}

// check if the amount of fronters is larger than the cutoff for the used widget
if (config.widgetFamily == "large") {
  if (list.length < largeWidgetCutoff) {
    l = list.length;
  } else {
    l = largeWidgetCutoff;
  }
} else {
  if (list.length < smallWidgetCutoff) {
    l = list.length;
  } else {
    l = smallWidgetCutoff;
  }
}

// create widget
let widget = createWidget(list, bgColor, textColor);
Script.setWidget(widget);
Script.complete();

// code to create widget text
function createWidget(list, color, textcolor) {
  let w = new ListWidget();
  w.backgroundColor = color;

  if (error != "") {
    errorTxt = w.addText(error);
    errorTxt.font = listFont;
    return w;
  }

  //display heading
  let titleTxt = w.addText(heading);
  titleTxt.textColor = textcolor;
  titleTxt.font = headerFont;
  titleTxt.textOpacity = 0.6;

  w.addSpacer(7);

  //display fronters list
  for (var i = 0; i < l; i++) {
    let s = w.addStack();

    if (useAvatar) {
      let img = s.addImage(imglist[i]);
      img.cornerRadius = 2;
      img.imageSize = imgSize;
    }
    s.addSpacer(10);

    let subTxt = s.addText(list[i]);
    subTxt.textColor = textcolor;
    subTxt.textOpacity = 1;
    subTxt.font = listFont;

    w.addSpacer(2);
  }
  // add a "more" if the amount of fronters is larger than the cutoff for the used widget
  if (l < list.length) {
    let st = w.addStack();
    let moreTxt = st.addText("More...");
    moreTxt.textColor = textcolor;
    moreTxt.textOpacity = 0.6;
    moreTxt.font = moreFont;
  }

  w.addSpacer();

  return w;
}
