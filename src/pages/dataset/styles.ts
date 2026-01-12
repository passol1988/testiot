/**
 * Dataset Manager Styles
 * 知识库管理页面样式定义（复用 bot-manager 样式）
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

// 卡片样式
export const botCard = {
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const cardStyles = {
  botCard,
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

// 按钮样式
export const botBtnPrimary = {
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  border: 'none',
  borderRadius: 20,
  height: 36,
  color: 'white',
};

export const botBtnSecondary = {
  borderRadius: 20,
  height: 36,
  border: '1px solid #d9d9d9',
};

export const botBtnDanger = {
  background: 'linear-gradient(135deg, #FF4D4F 0%, #F5222D 100%)',
  border: 'none',
  borderRadius: 20,
  height: 36,
  color: 'white',
};

export const buttonStyles = {
  botBtnPrimary,
  botBtnSecondary,
  botBtnDanger,
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
};

export const gridStyles = {
  gutter: 24,
  xs: 24,
  sm: 12,
  lg: 8,
  xl: 6,
};

export const tableStyles = {
  table: {
    borderRadius: 12,
    overflow: 'hidden',
  },
};

// 默认导出所有样式
export default {
  containerStyles,
  contentStyles,
  pageHeaderStyles,
  headerTitleStyles,
  cardStyles,
  buttonStyles,
  formStyles,
  gridStyles,
  tableStyles,
  botCard,
  botBtnPrimary,
  botBtnSecondary,
  botBtnDanger,
};
