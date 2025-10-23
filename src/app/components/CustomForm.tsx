import React, { useState, useEffect } from 'react';
import { isEmailValid, isPasswordValid } from '@/helpers/validations';

interface Field {
  name: string;
  type: string; // 'text', textarea, 'email', 'password', 'checkbox'
  validation?: string; // 'email', 'password'
  label?: string;
  rows?: number;
  htmlLabel?: string;
  initialValue?: string | null;
  required?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  displayPassDesc?: boolean;
}

interface CustomFormProps {
  fields: Field[];
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  disableSubmitBtn?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const CustomForm: React.FC<CustomFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  disableSubmitBtn = false,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [inputNameErrorsArray, setInputNameErrorsArray] = useState<string[]>([]);
  const [inputNameInvalidArray, setInputNameInvalidArray] = useState<string[]>([]);

  const onInputChange = ({
    e,
    field,
  }: {
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    field: Field;
  }) => {
    const inputName: string = field.name;
    const inputType: string = field.type;
    let newValue: string | number | boolean | Date | null = null;

    switch (inputType) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'password':
        newValue = e.target.value;
        break;

      default:
        break;
    }

    setFormValues({
      ...formValues,
      [inputName]: newValue,
    });
  };

  useEffect(() => {
    let initialValues = {};

    fields.forEach((field: any) => {
      initialValues = {
        ...initialValues,
        [field.name]: field.initialValue || null,
      };
    });

    setFormValues(initialValues);
  }, []);

  const submit = () => {
    let requiredMisingValues: string[] = [];
    let invalidValues: string[] = [];

    fields.forEach((field: any) => {
      const value = formValues[field.name] || null;

      if (field.required && [undefined, null, ''].includes(value)) {
        requiredMisingValues.push(field.name);
      }

      if(field.validation){
        switch(field.validation){
          case 'email':
            if(!isEmailValid(value)){
              invalidValues.push(field.name);
            }
            break;

          case 'password':
            if(!isPasswordValid(value)){
              invalidValues.push(field.name);
            }
            break;
          
          default:
            break;

        }
      }

    });

    if (requiredMisingValues.length === 0) setInputNameErrorsArray([]);
    if (invalidValues.length === 0) setInputNameInvalidArray([]);

    if (requiredMisingValues.length > 0 || invalidValues.length > 0) {
      setInputNameErrorsArray(requiredMisingValues);
      setInputNameInvalidArray(invalidValues);
      return;
    }

    onSubmit(formValues);
  };

  const labelTextDefault =
    'block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200';
  const labelTextError =
    'block mb-2 text-sm font-medium text-red-600 dark:text-red-400';

  const textInputDefault = `
    w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5
    text-sm text-gray-900 shadow-sm
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500
    dark:border-gray-600 dark:bg-gray-800 dark:text-white
    dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500
  `;

  const textInputError = `
    w-full rounded-xl border border-red-400 bg-white px-4 py-2.5
    text-sm text-gray-900 shadow-sm
    focus:border-red-500 focus:ring-2 focus:ring-red-500
    dark:border-red-500 dark:bg-gray-800 dark:text-white
    dark:focus:border-red-500 dark:focus:ring-red-500
  `;

  const checkboxInputDefault = `
    h-5 w-5 rounded-md border-gray-300 text-blue-600
    focus:ring-2 focus:ring-blue-500
    dark:border-gray-500 dark:bg-gray-700
  `;

  const labelCheckboxDefault =
    'ml-3 text-sm text-gray-800 dark:text-gray-200 [&_a]:text-blue-600 [&_a]:hover:underline';
  const labelCheckboxError =
    'ml-3 text-sm text-red-600 dark:text-red-400';

  return (
    <div className="max-w-md mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      {fields.map((field, index) => {
        const fieldError = inputNameErrorsArray.includes(field.name);
        const invalidField = inputNameInvalidArray.includes(field.name);
        return (
          <div key={index} className="mb-6">
            {field.label && !['checkbox'].includes(field.type) && (
              <label
                htmlFor={field.name}
                className={fieldError || invalidField ? labelTextError : labelTextDefault}
              >
                {field.label}
              </label>
            )}

            {['text', 'email'].includes(field.type) && (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formValues[field.name] ?? ''}
                onChange={(e) => onInputChange({ e, field })}
                disabled={field.disabled}
                className={fieldError || invalidField ? textInputError : textInputDefault}
              />
            )}

            {['textarea'].includes(field.type) && (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                value={formValues[field.name] ?? ''}
                onChange={(e) => onInputChange({ e, field })}
                disabled={field.disabled}
                rows={field.rows || 4}
                className={fieldError || invalidField ? textInputError : textInputDefault}
              />
            )}

            {['password'].includes(field.type) && (
              <>
              <input
                type="password"
                name={field.name}
                placeholder={field.placeholder}
                value={formValues[field.name] ?? ''}
                onChange={(e) => onInputChange({ e, field })}
                disabled={field.disabled}
                className={fieldError || invalidField ? textInputError : textInputDefault}
              />

              {field.displayPassDesc && (
                <div className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <small>
                    Password must:
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Be at least 8 characters long</li>
                      <li>Contain at least one lowercase letter (a-z)</li>
                      <li>Contain at least one uppercase letter (A-Z)</li>
                      <li>Contain at least one number (0-9)</li>
                      <li>
                        Contain at least one special character (e.g., !@#$%^&amp;*()_+)
                      </li>
                    </ul>
                  </small>
                </div>
              )}
              </>
            )}

            {['checkbox'].includes(field.type) && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={field.name} // added id to match htmlFor
                  name={field.name}
                  checked={formValues[field.name] ?? false}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [field.name]: e.target.checked,
                    })
                  }
                  disabled={field.disabled}
                  className={checkboxInputDefault}
                />
                <label
                  htmlFor={field.name}
                  className={
                    fieldError || invalidField ? labelCheckboxError : labelCheckboxDefault
                  }
                >
                  {field.htmlLabel ? (
                    <span dangerouslySetInnerHTML={{ __html: field.htmlLabel }} />
                  ) : (
                    field.label
                  )}
                </label>
              </div>
            )}

            {fieldError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                <small>This field is required.</small>
              </p>
            )}

            {invalidField && !fieldError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                <small>Invalid Value.</small>
              </p>
            )}
          </div>
        );
      })}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={disableSubmitBtn}
          className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition focus:outline-none
            ${
              disableSubmitBtn
                ? "bg-gray-400 text-white opacity-70 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
            }`}
        >
          {submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomForm;
