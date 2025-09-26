import Home from '../ui/pages/Home.jsx';
import CheckList from '../ui/pages/CheckList.jsx';
import AgedCheckList from '../ui/pages/AgedCheckList.jsx';
import AgedHome from '../ui/pages/AgedHome.jsx';
import PdiHome from '../ui/pages/PdiHome.jsx';
import HPromise from '../ui/pages/HPromise.jsx';
import LSHome from '../ui/pages/LSHome.jsx';

import BodyHome from '../ui/pages/BodyHome.jsx';

import LoadCsvFile from '../ui/pages/LoadCsvFile.jsx';
import History from '../ui/pages/History.jsx';
import Overview from '../ui/pages/Overview.jsx';

import PlzLogin from '../ui/pages/PlzLogin.jsx';
import CreateAccount from '../ui/pages/CreateAccount.jsx';
import ListAccounts from '../ui/pages/ListAccounts.jsx';
import ListUpdateAccounts from '../ui/pages/ListUpdateAccounts.jsx';
import ListUpdateModelNames from '../ui/pages/ListUpdateModelNames.jsx';
import ListUpdateDealerCodes from '../ui/pages/ListUpdateDealerCodes.jsx';

import NotFound from '../ui/pages/NotFound.jsx';
//import LSHomeTemp from '../ui/pages/LSHomeTemp.jsx';


const routes = [
    // {
    //     path: '/',
    //     component: Home
    // },
    //{
    //  path: '/about',
    //  component: About
    //},
    {
        path: '/PlzLogin',
        component: PlzLogin
    },
    {
        path: '/CreateAccount',
        component: CreateAccount
    },
    {
        path: '/ListAccounts',
        component: ListAccounts
    },
    {
        path: '/ListUpdateAccounts',
        component: ListUpdateAccounts
    },
      {
        path: '/ListUpdateModelNames',
        component: ListUpdateModelNames
    },
    {
        path: '/ListUpdateDealerCodes',
        component: ListUpdateDealerCodes
    },

    {
        path: '/AgedHome',
        component: AgedHome
    },
    {
        path: '/LSHome',
        component: LSHome
    },
    // {
    //     path: '/LSHomeTemp',
    //     component: LSHomeTemp
    // },
    // {
    //     path: '/BodyHomeTemp',
    //     component: BodyHomeTemp
    // },

    {
        path: '/',
        component: Home
    },
    {
        path: '/PdiHome',
        component: PdiHome
    },
    {
        path: '/BodyHome',
        component: BodyHome
    },
    {
        path: '/HPromise',
        component: HPromise
    },

    {
        path: '/AgedCheckList',
        component: AgedCheckList
    },
    {
        path: '/CheckList',
        component: CheckList,
        onStop: function() {
            //  console.log("someone left the 'Checklist'");
        }
    },
    {
        path: '/LoadCsvFile',
        component: LoadCsvFile
    },
    {
        path: '/History',
        component: History
    },
    {
        path: '/Overview',
        component: Overview
    },

    // {
    //   path: '/PdiHyundai',
    //   component: PdiHyundai
    // },
    // {
    //   path: '/InspectionForm',
    //   component: InspectionForm
    // },
    {
        path: '*',
        component: NotFound
    }
];

export default routes;
