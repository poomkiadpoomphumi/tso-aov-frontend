// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderSharedIcon from '@mui/icons-material/FolderOpen';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import WebIcon from '@mui/icons-material/Web';
import ShapeLineIcon from '@mui/icons-material/ShapeLine';
import RestoreIcon from '@mui/icons-material/Restore';
import DataObjectIcon from '@mui/icons-material/DataObject';
const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  ListAltIcon: ListAltIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  DashboardIcon: DashboardIcon,
  CodeOffIcon: CodeOffIcon,
  TaskAltIcon: TaskAltIcon,
  RestoreIcon: RestoreIcon,
  FolderSharedIcon: FolderSharedIcon,
  StorageIcon: StorageIcon,
  SecurityIcon: SecurityIcon,
  DataObjectIcon: DataObjectIcon,
  WebIcon: WebIcon,
  ShapeLineIcon: ShapeLineIcon,
};

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'navigation',
      title: 'AOV Service Request',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['DashboardIcon'],
          url: '/dashboard/default'
        },
        {
          id: 'RequestList',
          title: 'My Lists',
          type: 'item',
          url: '/MyList',
          icon: icons['RestoreIcon']
        },
      ]
    },
    {
      id: 'pages',
      title: 'Service',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'DigitalProjectRequest',
          title: 'Digital Project Request',
          type: 'item',
          url: '/DigitalRequestForm',
          icon: icons['ChromeReaderModeOutlinedIcon'],
          disabled: false
        },
        {
          id: 'FirewallRequest',
          title: 'Firewall Request',
          type: 'item',
          url: '/FireWallRequestForm',
          icon: icons['SecurityIcon'],
          disabled: false
        },
        {
          id: 'FileShareRequest',
          title: 'File Share Request',
          type: 'item',
          url: '/FileShareRequestForm',
          icon: icons['FolderSharedIcon'],
          disabled: true
        },
        {
          id: 'APIRequest',
          title: 'API Request',
          type: 'item',
          url: '#',
          icon: icons['DataObjectIcon'],
          disabled: true
        },
        {
          id: 'PmisSmartTSORequest',
          title: 'Pmis Smart TSO Request',
          type: 'item',
          url: '/BlankPage',
          icon: icons['ShapeLineIcon'],
          disabled: true
        },
        {
          id: 'TSOIntranetRequest',
          title: 'TSO Intranet Request',
          type: 'item',
          url: '/BlankPage',
          icon: icons['WebIcon'],
          disabled: true
        },
        {
          id: 'TSODataCenterRequest',
          title: 'TSO Data Center Request',
          type: 'item',
          url: '/BlankPage',
          icon: icons['StorageIcon'],
          disabled: true
        },
        /*         {
                  id: 'Other-system',
                  title: 'System is not activated',
                  type: 'collapse',
                  icon: icons['CodeOffIcon'],
                  children: [
                    {
                      id: 'blank-page1',
                      title: 'System is not activated',
                      type: 'item',
                      url: '/BlankPage',
                      disabled: true
                    },
                    {
                      id: 'blank-page2',
                      title: 'System is not activated',
                      type: 'item',
                      url: '/BlankPage',
                      disabled: true
                    }
                  ]
                } */
      ]
    }
  ]
};
