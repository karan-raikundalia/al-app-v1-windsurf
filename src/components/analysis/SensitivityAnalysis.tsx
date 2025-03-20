
import { AnalysisHeader } from "./sensitivity/AnalysisHeader";
import { AnalysisDescription } from "./sensitivity/AnalysisDescription";
import { AnalysisActions } from "./sensitivity/AnalysisActions";
import { SensitivityChart } from "./sensitivity/SensitivityChart";
import { SensitivitySummary } from "./sensitivity/SensitivitySummary";
import { SavedAnalyses } from "./sensitivity/SavedAnalyses";
import { AnalysisWizard } from "./sensitivity/AnalysisWizard";
import { useSensitivityAnalysis } from "./sensitivity/useSensitivityAnalysis";

export function SensitivityAnalysis() {
  const {
    selectedVariables,
    currentMetric,
    isLoading,
    baseValue,
    savedAnalyses,
    wizardOpen,
    variableRanges,
    impacts,
    showAnalysisView,
    outputMetrics,
    handleVariableSelection,
    handleMetricChange,
    handleBaseValueChange,
    handleRangeChange,
    handleRemoveVariable,
    handleUpdateChart,
    handleSaveAnalysis,
    handleDuplicateAnalysis,
    handleLoadAnalysis,
    handleDeleteAnalysis,
    handleResetAnalysis,
    handleNewAnalysis,
    handleExportPNG,
    handleExportPDF,
    handleExportExcel,
    handleWizardComplete,
    setWizardOpen
  } = useSensitivityAnalysis();

  return (
    <div className="space-y-6">
      <AnalysisHeader 
        onNewAnalysis={handleNewAnalysis}
        showAnalysisView={showAnalysisView}
      />
      
      <AnalysisDescription />
      
      {showAnalysisView ? (
        <>
          <div className="flex justify-end gap-2">
            <AnalysisActions 
              currentMetric={currentMetric}
              selectedVariables={selectedVariables}
              onSaveAnalysis={handleSaveAnalysis}
              onDuplicateAnalysis={() => {
                const name = handleDuplicateAnalysis();
                handleSaveAnalysis(name);
              }}
              onResetAnalysis={handleResetAnalysis}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
            />
          </div>
          
          <SensitivityChart 
            selectedVariables={selectedVariables}
            currentMetric={currentMetric}
            isLoading={isLoading}
            baseValue={baseValue}
            variableRanges={variableRanges}
            onRangeChange={handleRangeChange}
            onRemoveVariable={handleRemoveVariable}
            onUpdateChart={handleUpdateChart}
            impacts={impacts}
          />
          
          <SensitivitySummary 
            selectedVariables={selectedVariables}
            currentMetric={currentMetric}
            baseValue={baseValue}
          />
        </>
      ) : (
        <SavedAnalyses 
          savedAnalyses={savedAnalyses}
          onLoadAnalysis={handleLoadAnalysis}
          onDeleteAnalysis={handleDeleteAnalysis}
          onDuplicateAnalysis={handleDuplicateAnalysis}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
      
      <AnalysisWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}
