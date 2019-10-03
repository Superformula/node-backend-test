import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import View from "./components/View";
import UserCrud from "./views/UserCrud";

type Props = {};

const theme = createMuiTheme({});

const App: React.FC<Props> = ({}) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <View>
            <Switch>
              <Route path="/" component={UserCrud} />
            </Switch>
          </View>
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
