'use client';

import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

function Header({ toggleColorMode = () => {} }) {
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const pages = [
    { name: 'About', path: '/about' },
    { name: 'Universities', path: '/universities' },
    { name: 'Resources', path: '/resources' },
    { name: 'Enter KCSE Results', path: '/kcse-input' },
  ];

  const settings = [
    { name: 'Sign In', path: '/sign-in' },
    { name: 'Sign Up', path: '/sign-up' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SchoolIcon sx={{ mr: 1 }} />
          KCSE CareerGuide
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleDrawerToggle}
          aria-label="close drawer"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.name || ''} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path || ''}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={page.name || ''} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={toggleColorMode}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText
              primary={
                theme.palette.mode === 'dark'
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ bgcolor: theme.palette.background.default }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <SchoolIcon sx={{ mr: 1 }} />
            KCSE CareerGuide
          </Typography>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <SchoolIcon sx={{ mr: 1 }} />
            KCSE CareerGuide
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name || ''}
                component={RouterLink}
                to={page.path || ''}
                sx={{
                  my: 2,
                  color: 'text.primary',
                  display: 'block',
                  textTransform: 'none',
                }}
              >
                {page.name || ''}
              </Button>
            ))}
          </Box>

          {/* Theme Toggle */}
          <Box sx={{ mr: 2 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name || ''}
                  component={RouterLink}
                  to={setting.path || ''}
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">
                    {setting.name || ''}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;
