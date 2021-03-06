import { Fragment, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Drawer,
  Divider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import clsx from "clsx";
import GetAppIcon from "@material-ui/icons/GetApp";
import Hidden from "@material-ui/core/Hidden";
import { useTheme } from "@material-ui/core/styles";
import AddBoxSharpIcon from "@material-ui/icons/AddBoxSharp";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CloseIcon from "@material-ui/icons/Close";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import MenuIcon from "@material-ui/icons/Menu";
import GithubCorner from "react-github-corner";
import { Footer } from "./Footer";
import { useStyles } from "./constants/";
import { VoiceRecoderModal } from "../VoiceRecorderModal/";
import { saveAs } from "file-saver";

export function TextEditor(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [textIdArr, setTextIdArr] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");
  const [textId, setTextId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    let localKey = localStorage.getItem("TextIds");

    if (localKey == null) {
      const newId = uuidv4();
      textIdArr.push(newId);
      localStorage.setItem("TextIds", JSON.stringify([newId]));
      localStorage.setItem(newId, "");
      setTextId(newId);
      setTextIdArr(textIdArr);
      setTextContent("");
    } else {
      if (textId === "") {
        let textIds = JSON.parse(localStorage.getItem("TextIds") || "{}");
        setTextIdArr(textIds);
        let value = localStorage.getItem(textIds[0])!;
        setTextId(textIdArr[0]);
        setTextContent(value);
      }
    }
  }, [textContent, textId, textContent, textIdArr]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    const newId = uuidv4();
    textIdArr.push(newId);
    localStorage.setItem("TextIds", JSON.stringify(textIdArr));
    localStorage.setItem(newId, "");
    setTextIdArr(textIdArr);
    setTextId(newId);
    setTextContent("");
  };

  const handleTextContent = (event: any) => {
    let value = event?.target.value;
    localStorage.setItem(textId, value);
    setTextContent(value);
  };

  const handleGetContent = (id: any, index: number) => {
    const content = localStorage.getItem(id)!;
    setSelectedIndex(index);
    setTextId(id);
    setTextContent(content);
  };

  const getTitle = (id: string) => {
    const content: string = localStorage.getItem(id)!;
    let title = "Untitled";
    if (content) {
      if (content.length >= 25) {
        title = content.substring(0, 25).concat("...");
      } else {
        title = content.substring(0, 25);
      }
    }
    return title;
  };

  const handleDelete = (id: any) => {
    localStorage.removeItem(id);
    let textIds = JSON.parse(localStorage.getItem("TextIds") || "{}");
    var filteredAry = textIds.filter((e: any) => e !== id);
    localStorage.setItem("TextIds", JSON.stringify(filteredAry));
    setTextIdArr(filteredAry);
    if (filteredAry.length === 0) {
      const newId = uuidv4();
      textIdArr.length = 0;
      textIdArr.push(newId);
      localStorage.setItem("TextIds", JSON.stringify([newId]));
      localStorage.setItem(newId, "");
      setTextId(newId);
      setTextIdArr(textIdArr);
      setTextContent("");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = (voiceContent: any) => {
    const content = textContent + voiceContent;
    localStorage.setItem(textId, content);
    setTextContent(content);
    setOpenDialog(false);
  };

  const handleExportTxt = () => {
    const content = localStorage.getItem(textId)!;
    const data = new Blob([content], { type: "text/plain" });
    saveAs(data, "WordPadExport.txt");
  };
  return (
    <Fragment>
      <VoiceRecoderModal open={openDialog} onClose={handleCloseDialog} />
      <div className={classes.root}>
        <CssBaseline />
        <Hidden smUp implementation="css">
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                WordPad
              </Typography>
              <div className={classes.drawerHeader}>
                <Tooltip title="Add" aria-label="add">
                  <IconButton color="inherit" size="medium" onClick={handleAdd}>
                    <AddBoxSharpIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={classes.drawerHeader}>
                <Tooltip title="Convert speech to text" aria-label="speech">
                  <IconButton
                    color="inherit"
                    size="medium"
                    onClick={handleOpenDialog}
                  >
                    <RecordVoiceOverIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className={classes.drawerHeader}>
                <Tooltip title="Export to .txt file" aria-label="export">
                  <IconButton
                    color="inherit"
                    size="medium"
                    onClick={handleExportTxt}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerToggle}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <List>
              {textIdArr.map((id, i) => (
                <div key={i}>
                  <Divider />
                  <ListItem
                    button
                    id={id}
                    selected={selectedIndex === i}
                    onClick={event => handleGetContent(id, i)}
                  >
                    <ListItemText primary={getTitle(id)} />
                    <ListItemSecondaryAction>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={event => handleDelete(id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              ))}
            </List>
            <Divider />
            <Footer />
          </Drawer>
        </Hidden>

        <Hidden xsDown implementation="css">
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                WordPad
              </Typography>
              <div className={classes.drawerHeader}>
                <Tooltip title="Add" aria-label="add">
                  <IconButton color="inherit" size="medium" onClick={handleAdd}>
                    <AddBoxSharpIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={classes.drawerHeader}>
                <Tooltip title="Convert speech to text" aria-label="speech">
                  <IconButton
                    color="inherit"
                    size="medium"
                    onClick={handleOpenDialog}
                  >
                    <RecordVoiceOverIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className={classes.drawerHeader}>
                <Tooltip title="Export to .txt file" aria-label="export">
                  <IconButton
                    color="inherit"
                    size="medium"
                    onClick={handleExportTxt}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <List>
              {textIdArr.map((id, i) => (
                <div key={i}>
                  <Divider />
                  <ListItem
                    button
                    id={id}
                    selected={selectedIndex === i}
                    onClick={event => handleGetContent(id, i)}
                  >
                    <ListItemText primary={getTitle(id)} />
                    <ListItemSecondaryAction>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={event => handleDelete(id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              ))}
            </List>
            <Divider />
            <Footer />
          </Drawer>
        </Hidden>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <TextField
            placeholder="Your content.."
            fullWidth
            multiline
            spellCheck
            value={textContent || ""}
            onChange={handleTextContent}
            InputProps={{ disableUnderline: true }}
            inputRef={input => input && input.focus()}
          />
        </main>
      </div>
      <GithubCorner href="https://github.com/bhuvanbalasubramanian/wordpad" />
    </Fragment>
  );
}
