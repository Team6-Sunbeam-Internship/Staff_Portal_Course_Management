import { Breadcrumb } from '../../common'
// import { ContentHeader } from './ContentHeader'
import { selectBreadcrumbs } from '../../../store'
import { useSelector } from 'react-redux'
const MainContent = ({
  children,

  className = '',
  ...props
}) => {
  
  const [breadcrumbItems] = useSelector(selectBreadcrumbs);
  const baseClasses = [
    'flex-1 flex flex-col overflow-hidden bg-secondary-50 dark:bg-secondary-900',
    className
  ].filter(Boolean).join(' ')

  return (
    <main className={baseClasses} {...props}>
      {/* Breadcrumb navigation */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </div>
    </main>
  )
}

export default MainContent



