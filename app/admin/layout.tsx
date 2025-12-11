'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Train as TrainIcon,
  AccountCircle,
  Menu as MenuIcon,
  Instagram as InstagramIcon,
  Home as HomeIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth')
        if (!response.ok) {
          router.push('/admin/login')
        } else {
          setLoading(false)
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [isLoginPage, router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  if (isLoginPage) {
    return children
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: 'MarioFont, sans-serif' }}>
          Loading...
        </Typography>
      </Box>
    )
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Destinations', path: '/admin/destinations', icon: <LocationIcon /> },
    { label: 'Journeys', path: '/admin/journeys', icon: <TrainIcon /> },
    { label: 'Home Locations', path: '/admin/home-locations', icon: <HomeIcon /> },
    { label: 'Email Subscriptions', path: '/admin/email-subscriptions', icon: <EmailIcon /> },
    { label: 'Instagram Import', path: '/admin/instagram-import', icon: <InstagramIcon /> }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          {/* Mobile Menu */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' }, color: '#373737' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo/Title */}
          <Typography
            variant="h6"
            component={Link}
            href="/admin/dashboard"
            sx={{
              fontFamily: 'MarioFontTitle, sans-serif',
              color: '#373737',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 }
            }}
          >
            Joey Hou Journal Admin
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                startIcon={item.icon}
                sx={{
                  color: pathname.startsWith(item.path) ? '#FFD701' : '#373737',
                  fontFamily: 'MarioFont, sans-serif',
                  backgroundColor: pathname.startsWith(item.path) ? 'rgba(255, 215, 1, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 1, 0.2)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{ color: '#373737' }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Mobile Menu */}
          <Menu
            id="mobile-menu"
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                component={Link}
                href={item.path}
                onClick={handleMobileMenuClose}
                selected={pathname.startsWith(item.path)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  {item.label}
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  )
}
