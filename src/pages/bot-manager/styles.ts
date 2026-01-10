/**
 * Bot Manager Styles
 * 页面样式定义
 */

export const containerStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%)',
};

export const contentStyles = {
  maxWidth: 1400,
  margin: '0 auto',
  padding: '24px 20px 80px',
};

export const pageHeaderStyles = {
  marginBottom: 24,
  paddingBottom: 16,
  borderBottom: '1px solid #f0f0f0',
};

export const headerTitleStyles = {
  fontSize: 24,
  fontWeight: 600,
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const cardStyles = {
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

export const formStyles = {
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '2px solid #FF6B6B',
    display: 'inline-block',
  },
  sectionCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  uploadArea: {
    border: '2px dashed #FF6B6B',
    borderRadius: 12,
    padding: '24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  previewCard: {
    background: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
};

export const buttonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    border: 'none',
    borderRadius: 20,
    height: 36,
  },
  secondary: {
    borderRadius: 20,
    height: 36,
  },
};

export const callStyles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: '16px 20px',
    background: 'rgba(26, 26, 46, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  content: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px 120px',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    overflow: 'hidden',
    marginBottom: 24,
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hangupButton: {
    background: 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)',
    boxShadow: '0 4px 16px rgba(255, 68, 68, 0.4)',
  },
  callButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
    boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
  },
};

export const keyframes = {
  pulse: `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  `,
  wave: `
    @keyframes wave {
      0% {
        transform: scaleY(0.5);
      }
      50% {
        transform: scaleY(1);
      }
      100% {
        transform: scaleY(0.5);
      }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
};

export const selectorStyles = {
  card: {
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center' as const,
  },
  cardSelected: {
    borderColor: '#FF6B6B',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
  },
  label: {
    fontSize: 14,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
};

export const modalStyles = {
  previewContent: {
    maxHeight: 400,
    overflowY: 'auto' as const,
    padding: 16,
    background: '#F5F5F5',
    borderRadius: 8,
    whiteSpace: 'pre-wrap' as const,
    fontSize: 13,
    lineHeight: 1.8,
  },
};
