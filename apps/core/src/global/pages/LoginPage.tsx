import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Input, Toast, Dialog, DialogContent, DialogFooter, LoginForm, type LoginFormData } from '@plug/ui'
import { useSignInWithInfo, useChangePassword } from '@plug/common-services/services'
import type { SignInRequest } from '@plug/common-services'
import { useAuthStore } from '@/global/store'
import { toast } from 'sonner'

const LoginPage: React.FC = () => {
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const { execute: signInWithInfo, isLoading: isSigningIn, error: signInError } = useSignInWithInfo()
  const { isAuthenticated, setAuthenticated, setUser, user, hasRole } = useAuthStore()
  const { execute: changePassword, isLoading: isChangingPassword } = useChangePassword()
  
  if (isAuthenticated && user && !user.shouldChangePassword) {
    const hasAdminRole = hasRole('ADMIN')
    return <Navigate to={hasAdminRole ? "/admin" : "/"} replace />
  }

  const handleSubmit = async (data: LoginFormData) => {
    const signInData: SignInRequest = { username: data.username, password: data.password }
    const result = await signInWithInfo(signInData)
    
    if (result.userInfo?.shouldChangePassword) {
        setShowPasswordChangeModal(true);
        return;
    }

    if (result.success && result.userInfo) {
      setAuthenticated(true);
      setUser(result.userInfo);
      
      // 사용자 정보를 설정한 후 store의 hasRole 사용
      const hasAdminRole = result.userInfo.roles ? Array.from(result.userInfo.roles).some(role => role.name === 'ADMIN') : false
      
      if (hasAdminRole) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      toast.error('로그인에 실패했습니다.')
      console.error('로그인 실패:', result.error?.message)
    }
  }

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('새 비밀번호와 비밀번호 확인을 모두 입력해주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await changePassword({ password: newPassword })
      
      if (user) {
        const updatedUser = { ...user, shouldChangePassword: false }
        setUser(updatedUser)
      }
      
      setShowPasswordChangeModal(false)
      setNewPassword('')
      setConfirmPassword('')
      
      const hasAdminRole = hasRole('ADMIN')
      navigate(hasAdminRole ? '/admin' : '/')
      
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
      console.error('비밀번호 변경 실패:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onSubmit={handleSubmit}
        isLoading={isSigningIn}
        error={signInError?.message || null}
      />
      
      {/* 비밀번호 변경 모달 */}
      <Dialog open={showPasswordChangeModal} onOpenChange={setShowPasswordChangeModal}>
        <DialogContent 
          title="비밀번호 변경 필요" 
          disableBackground={true}
          showCloseButton={false}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              보안을 위해 비밀번호를 변경해주세요.
            </p>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Toast 컴포넌트 */}
      <Toast />
    </div>
  )
}

export default LoginPage
