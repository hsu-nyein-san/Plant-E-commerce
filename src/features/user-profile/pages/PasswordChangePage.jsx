
import React from 'react'
import PasswordChangeForm from '../components/PasswordChangeForm'
import BreadCrumb from '../../../components/BreadCrumb'
import Container from '../../../components/Container'

const PasswordChangePage = () => {
  return (
    <Container>
      <div className="min-h-screen bg-gray-50">
      <div className="pt-6">
        <BreadCrumb links={[{title:"My Account",path:"/user-profile"}]} currentPageTitle="Change Password" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Change Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your password to keep your account secure.
          </p>
        </div>

        <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
    </Container>
  )
}

export default PasswordChangePage
