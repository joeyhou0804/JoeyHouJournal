'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material'
import AdminLoading from 'src/components/AdminLoading'

interface EmailSubscription {
  id: number
  name: string
  email: string
  preferredLocale: string
  subscribedAt: string
  isActive: boolean
  unsubscribeToken: string
}

export default function EmailSubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<EmailSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    // Filter subscriptions based on search term
    if (searchTerm.trim() === '') {
      setFilteredSubscriptions(subscriptions)
    } else {
      const lowercaseSearch = searchTerm.toLowerCase()
      const filtered = subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(lowercaseSearch) ||
        sub.email.toLowerCase().includes(lowercaseSearch)
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchTerm, subscriptions])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/email-subscriptions')
      const data = await response.json()
      setSubscriptions(data)
      setFilteredSubscriptions(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch email subscriptions:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this email subscription?')) return

    try {
      const response = await fetch('/api/admin/email-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _method: 'DELETE' })
      })

      if (response.ok) {
        alert('Email subscription deleted!')
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Failed to delete email subscription:', error)
      alert('Failed to delete email subscription')
    }
  }

  if (loading) {
    return <AdminLoading message="Loading Email Subscriptions..." />
  }

  return (
    <Box sx={{ fontFamily: 'MarioFont, sans-serif' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '2rem', gap: { xs: 2, sm: 0 } }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(24px, 6vw, 36px)', margin: 0 }}>
          Email Subscriptions ({filteredSubscriptions.length})
        </h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          style={{
            width: '100%',
            maxWidth: '200px',
            padding: '0.75rem 1.5rem',
            fontSize: '16px',
            fontFamily: 'MarioFont, sans-serif',
            backgroundColor: 'white',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '1rem', sm: '2rem' },
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', marginBottom: '1.5rem' }}>
          Search Subscriptions
        </Typography>

        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <TextField
            label="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            placeholder="Enter name or email..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#999', marginRight: '0.5rem' }} />
            }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: 'white',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Clear
            </button>
          )}
        </Box>
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredSubscriptions.length === 0 ? (
          <Box sx={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif', backgroundColor: 'white', borderRadius: '1rem' }}>
            {searchTerm ? 'No matching subscriptions found' : 'No email subscriptions found'}
          </Box>
        ) : (
          filteredSubscriptions.map((subscription) => (
            <Box
              key={subscription.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '18px', marginBottom: '0.5rem', color: '#373737' }}>
                {subscription.name}
              </Box>
              <Box sx={{ fontSize: '14px', color: '#666', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif' }}>
                {subscription.email}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '14px', fontFamily: 'MarioFont, sans-serif', color: '#666', marginBottom: '1rem' }}>
                <Box><strong>Language:</strong> {subscription.preferredLocale === 'en' ? 'English' : 'Chinese'}</Box>
                <Box><strong>Subscribed:</strong> {new Date(subscription.subscribedAt).toLocaleDateString()}</Box>
              </Box>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDelete(subscription.email)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    fontFamily: 'MarioFont, sans-serif',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: '2px solid #c92a2a',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Desktop Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Name</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Email</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Language</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Subscribed Date</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                    {searchTerm ? 'No matching subscriptions found' : 'No email subscriptions found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{subscription.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{subscription.email}</TableCell>
                    <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                      {subscription.preferredLocale === 'en' ? 'English' : 'Chinese'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                      {new Date(subscription.subscribedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(subscription.email)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '14px',
                          fontFamily: 'MarioFont, sans-serif',
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: '2px solid #c92a2a',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
