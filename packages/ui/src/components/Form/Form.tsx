import React, { createContext, useContext, useState, forwardRef, JSX, ReactElement} from 'react'
import { FormValues, FormProps, FormContextType, FormItemProps, FormFieldProps,} from './Form.types'
import { cn } from '../../utils/classname'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextType<any> | undefined>(undefined);

const FormInner = <T extends FormValues>(
    props: FormProps<T>,
    _ref: React.Ref<{ reset: () => void }> // eslint-disable-line
): JSX.Element => {
    const { children, onSubmit, validate, initialValues } = props;
  const [formValues, setFormValues] = useState<T>(initialValues ?? ({} as T))
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string>>>({})

  const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validateField = <K extends keyof T>(name: K, value: T[K]) => {
    if (!validate) return
    const fieldError = validate({ ...formValues, [name]: value })[name]
    setFormErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate) {
      const errors = validate(formValues)
      setFormErrors(errors)
      const hasError = Object.values(errors).some((msg) => msg !== undefined)
      if (hasError) return
    }
    onSubmit(formValues)
  }

  return (
      <form onSubmit={handleSubmit}>
        <FormContext.Provider
            value={{ values: formValues, setFieldValue, validateField, setFormErrors, errors: formErrors } as FormContextType<T>}
        >
          {children}
        </FormContext.Provider>
      </form>
  )
}

const Form = Object.assign(
    forwardRef(FormInner) as <T extends FormValues>(
        props: FormProps<T> & { ref?: React.Ref<{ reset: () => void }> }
    ) => JSX.Element,
    { displayName: 'Form' }
)

const FormItem = <T extends FormValues>({
                                          name,
                                          children,
                                          label,
                                          required = false,
    validate,
                                        }: FormItemProps<T>): JSX.Element => {
  const formContext = useContext(FormContext) as FormContextType<T>;
  if (!formContext) throw new Error('Form 컴포넌트 안에서만 사용하세요.')

  const { values, setFieldValue, setFormErrors, errors } = formContext;

    const handleChange = (value: T[typeof name]) => {
        setFieldValue(name, value);
        if (validate) {
            const validators = Array.isArray(validate) ? validate : [validate];
            const error = validators.map(v => v(value)).find(msg => !!msg);
            setFormErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

  if (!React.isValidElement(children)) {
    throw new Error('children은 value, onChange가 있는 유효한 컴포넌트여야 합니다.')
  }

  const typedChild = children as ReactElement<FormFieldProps<T[typeof name]>>

  const childElement = React.cloneElement(typedChild, {
    value: values[name] ?? '',
    onChange: handleChange,
    required,
  })

  return (
      <div className={cn('flex flex-col mb-4')}>
        {label && (
            <label htmlFor={String(name)} className="text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        {childElement}
        {errors?.[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
      </div>
  )
}

FormItem.displayName = 'FormItem'

export { Form, FormItem }
