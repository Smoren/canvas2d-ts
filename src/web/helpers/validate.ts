export type ValidationRule = {
  rule: (value: string | number) => boolean;
  message: string;
  invalid: boolean;
};

export type ValidationRules<T extends string = string> = Record<
  T,
  ValidationRule | ValidationRule[]
>;

export const validate = (
  validationRules: ValidationRules,
  values: Record<keyof ValidationRules, unknown>
) => {
  let isValid = true;
  Object.keys(validationRules).forEach((key: string) => {
    const newKey = key as keyof typeof validationRules;
    const isRuleValid = validateRule(
      validationRules[newKey] as ValidationRule | ValidationRule[],
      values[newKey] as unknown
    );
    if (!isRuleValid) {
      isValid = false;
    }
  });

  return isValid;
};

export const validateRule = (
  ruleToValidate: ValidationRule | ValidationRule[],
  value: unknown
) => {
  let isValid = true;
  if (Array.isArray(ruleToValidate)) {
    (ruleToValidate as ValidationRule[])?.forEach((rule: ValidationRule) => {
      (rule as ValidationRule).invalid = !rule.rule(
        // @ts-ignore
        value
      );
      if ((rule as ValidationRule).invalid) {
        isValid = false;
      }
    });
  } else {
    (ruleToValidate as ValidationRule).invalid = !(
      ruleToValidate as ValidationRule
    ).rule(
      // @ts-ignore
      value
    );
    if ((ruleToValidate as ValidationRule).invalid) {
      isValid = false;
    }
  }
  return isValid;
};
