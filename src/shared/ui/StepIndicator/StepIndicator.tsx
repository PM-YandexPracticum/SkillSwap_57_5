import clsx from 'clsx';
import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  // Создаем массив длиной totalSteps для рендера полосочек
  const stepsArray = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className={styles.container}>
      <span className={styles.text}>
        Шаг {currentStep} из {totalSteps}
      </span>
      <div className={styles.linesContainer}>
        {stepsArray.map((step) => (
          <div
            key={step}
            className={clsx(styles.line, {
              [styles.lineActive]: step <= currentStep,
            })}
          />
        ))}
      </div>
    </div>
  );
}
