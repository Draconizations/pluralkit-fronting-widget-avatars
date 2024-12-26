// ORIGINAL CODE BY VRISKA OF THE COLLECTIVE (ramblingArachnid#8781)
// AVATAR, TIMESTAMP AND SIDEBAR ADDITION BY PALS (Fulmine#1917)

//INPUT SYSTEM ID BELOW, SURROUNDED BY DOUBLE QUOTES
const systemID = ""

//INCLUDE TOKEN BELOW (found by running pk;token) IF YOUR SYSTEM FRONT INFORMATION IS PRIVATE
//MAKE SURE IT IS SURROUNDED BY DOUBLE QUOTES
const token = "yourtoken";

// Use Display Names
// set true if you would like to use display names instead of names where available. Set to false to only use names.
const useDisplayNames = true;

// Use First Fronter's Color as Widget Background Color
// set to false if you would like to use black/white as opposed to the first fronter's color for the widget.
const useFirstFronterColorAsBackgroundColor = false;

// AVATARS
// set false to disable avatars
const useAvatar = true;

// Use Proxy Avatars
// set true if you would like to use proxy avatars instead of regular avatars
const useProxyAvatars = true;

// TIMESTAMPS
// if set to true it show the amount of time between the switch and now.
const useTimestamp = true;

// GRADIENT SIDEBAR:
// if useGradient is set to true, a sidebar with a gradient of all the member colors will appear
// if blockedGradient is set to true, the sidebar will be blocks of color, rather than a smooth gradient
const useGradient = true;
const blockedGradient = false;

// WIDGET CUTOFF: only edit if necessary
// changes the amount of members visible on the widget before a "more..." gets added. to prevent overflow
// the small cutoff works for small and medium widgets, the large cutoff for the large widget
const smallWidgetCutoff = 4;
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

var gradient = new LinearGradient();

if (headerFontName != "") {
  headerFont = new Font(headerFontName, headerFontSize);
}
if (listFontName != "") {
  listFont = new Font(listFontName, listFontSize);
}
if (moreFontName != "") {
  moreFont = new Font(moreFontName, moreFontSize);
}

var time = "";
list = [];
imglist = [];
colorlist = [];

const url = `https://api.pluralkit.me/v2/systems/${systemID}/fronters`;

const req = new Request(url);
if (token) req.headers = { Authorization: token };

let res = await req.loadJSON();

if (res.code === 0) {
  if (res.message === "401: Missing or invalid Authorization header") error = res.message + ". Please add your token at the top of the script.";  
  else error = "Something went wrong, please try again later."
}

if (error == "") {
  if (useTimestamp == true) {
  
  // find the difference between the current time and the time of the switch in seconds
    var now = new Date();
    var timestamp = new Date(res.timestamp);
    var diff = Math.abs(now - timestamp)/1000
  
  // convert the difference in seconds to days, hours, minutes and seconds
    var days = Math.floor(diff / 86400);
    diff -= days * 86400;
    
    var hours = Math.floor(diff / 3600);
    diff -= hours * 3600;
    
    var minutes = Math.floor(diff / 60);
    diff -= minutes * 60;
    
    var seconds = Math.floor(diff % 60);
    
  // build a string displaying the days, hours, minutes and seconds in the same way pluralkit displays them
    time = time + minutes + "m"
    if (hours > 0) {
      time = hours + "h " + time
    }
    if (days > 0) {
      time = days + "d " + time
    }
    if (hours < 1 && days < 1) {
      time = time + " " + seconds + "s"
    }
    time = "For " + time
  }

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
      if (useProxyAvatars && res.members[i].webhook_avatar_url) {
        let image = new Request(res.members[i].webhook_avatar_url);
        let img = await image.loadImage();
        imglist.push(img);
      } else if (res.members[i].avatar_url) {
        let image = new Request(res.members[i].avatar_url);
        let img = await image.loadImage();
        imglist.push(img);
      } else {
        let image = new Request(avatarPlaceholder);
        let img = await image.loadImage();
        imglist.push(img);
      }
    }
      if (res.members[i].color) {
        colorlist.push(new Color(res.members[i].color));  
        if (blockedGradient) colorlist.push(new Color(res.members[i].color));
      }
    }
    
   if (useGradient) {
    if (colorlist.length > 0) {
      let locations = [0];
        
       if (colorlist.length > 1) {
       locations = [];
       for (var i = 0; i < colorlist.length; i++) {
          if (blockedGradient) {
            locations.push(1 / (colorlist.length) * 2 * i);
            locations.push(1 / (colorlist.length) * 2 * (i + 1));  
          } else {
            locations.push((1 / colorlist.length / 4) + (1 - 1 / colorlist.length / 2) / (colorlist.length - 1) * i);
          }
        }
      }
      
      gradient.colors = colorlist;
      gradient.startPoint = new Point(0, 0);
      gradient.endPoint = new Point(0, 1);
      gradient.locations = locations;
    }
  }
}

const isLarge = config.widgetFamily == "large"
// check if the amount of fronters is larger than the cutoff for the used widget
if (isLarge) {
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
  w.setPadding(0, 0, 0, 0);

  if (error != "") {
    errorTxt = w.addText(error);
    errorTxt.font = listFont;
    return w;
  }
  
  let a = w.addStack();
  
  if (useGradient) {
    let b = a.addStack();
    b.backgroundGradient = gradient;
    b.size = new Size(15, 0);
    b.layoutVertically();
    b.addSpacer();  
  }
  
  let c = a.addStack();
  a.addSpacer();
  
  c.layoutVertically();
  c.setPadding(isLarge ? 8 : 6, 12, 2, 7);
  c.backgroundColor = color;

  //display heading  
  let titleTxt = c.addText(heading);
  titleTxt.textColor = textcolor;
  titleTxt.font = headerFont;
  if (useFirstFronterColorAsBackgroundColor == false) titleTxt.textOpacity = 0.6;
  
  //display timestamp
  if (time != "") {
    let timeTxt = c.addText(time)
    timeTxt.textColor = textcolor;
    timeTxt.font = listFont;
    if (useFirstFronterColorAsBackgroundColor == false) timeTxt.textOpacity = 0.4
  }

  //display fronters list
  for (var i = 0; i < l; i++) {
    let s = c.addStack();

    if (useAvatar && imglist.length > 0) {
      let img = s.addImage(imglist[i]);
      img.cornerRadius = 2;
      img.imageSize = imgSize;
      s.addSpacer(10);
    }

    let subTxt = s.addText(list[i]);
    subTxt.textColor = textcolor;
    subTxt.textOpacity = 1;
    subTxt.font = listFont;

    c.addSpacer(2);
  }
  // add a "more" if the amount of fronters is larger than the cutoff for the used widget
  if (l < list.length) {
    let st = c.addStack();
    let moreTxt = st.addText("More...");
    moreTxt.textColor = textcolor;
    moreTxt.textOpacity = 0.6;
    moreTxt.font = moreFont;
  }

  c.addSpacer();

  return w;
}
