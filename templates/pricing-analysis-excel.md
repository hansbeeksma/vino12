# Van Westendorp Excel Analysis Template

**Purpose:** Analyse Van Westendorp survey data om optimale prijspunten te identificeren
**Tool:** Microsoft Excel of Google Sheets
**Input:** Survey responses export (CSV/XLSX)
**Output:** Grafiek met 4 crosspoints (PMC, PME, OPP, IPP) per pricing model

---

## Excel Template Structuur

### Spreadsheet Tabs

1. **RAW DATA** - Import van survey export
2. **PER FLES** - Analyse voor per fles model
3. **MAANDELIJKS** - Analyse voor maandelijks abonnement
4. **KWARTAAL** - Analyse voor kwartaalabonnement
5. **BUNDEL** - Analyse voor bundel model
6. **SUMMARY** - Overzicht van alle optimale prijspunten
7. **SEGMENTS** - Segmentatie analyse

---

## Tab 1: RAW DATA

### Import Survey Export

**Kolommen van Typeform/Google Forms:**

| Column                       | Description                        | Example                     |
| ---------------------------- | ---------------------------------- | --------------------------- |
| `Timestamp`                  | Response datum/tijd                | 2026-02-15 14:32:05         |
| `Q1_Monthly_Budget`          | Maandelijks wijnbudget             | €50 - €100                  |
| `Q2_Purchase_Frequency`      | Aankoopfrequentie                  | Maandelijks                 |
| `Q3_Purchase_Channel`        | Waar koop je wijn                  | Supermarkt; Slijterij       |
| `Q4a_PerBottle_TooCheap`     | Per fles - Te goedkoop             | 5.00                        |
| `Q4b_PerBottle_Bargain`      | Per fles - Koopje                  | 8.00                        |
| `Q4c_PerBottle_Expensive`    | Per fles - Aan de dure kant        | 15.00                       |
| `Q4d_PerBottle_TooExpensive` | Per fles - Te duur                 | 25.00                       |
| `Q5a_Monthly_TooCheap`       | Maandelijks - Te goedkoop          | 15.00                       |
| `Q5b_Monthly_Bargain`        | Maandelijks - Koopje               | 25.00                       |
| `Q5c_Monthly_Expensive`      | Maandelijks - Aan de dure kant     | 40.00                       |
| `Q5d_Monthly_TooExpensive`   | Maandelijks - Te duur              | 60.00                       |
| `Q6a_Quarterly_TooCheap`     | Kwartaal - Te goedkoop             | 50.00                       |
| `Q6b_Quarterly_Bargain`      | Kwartaal - Koopje                  | 80.00                       |
| `Q6c_Quarterly_Expensive`    | Kwartaal - Aan de dure kant        | 130.00                      |
| `Q6d_Quarterly_TooExpensive` | Kwartaal - Te duur                 | 200.00                      |
| `Q7_Bundle_Preference`       | Bundel voorkeur                    | Dinerbundel (3 flessen)     |
| `Q7a_Bundle_TooCheap`        | Bundel - Te goedkoop               | 20.00                       |
| `Q7b_Bundle_Bargain`         | Bundel - Koopje                    | 35.00                       |
| `Q7c_Bundle_Expensive`       | Bundel - Aan de dure kant          | 60.00                       |
| `Q7d_Bundle_TooExpensive`    | Bundel - Te duur                   | 90.00                       |
| `Q8_Commitment_Score`        | Waarschijnlijkheid proberen (1-10) | 8                           |
| `Q9_Appeal_Factors`          | Wat spreekt aan (multiple)         | Gepersonaliseerd; Ontdekken |
| `Q10_Email`                  | Email adres                        | user@example.com            |

**Setup:**

1. Importeer CSV/XLSX van Typeform/Google Forms
2. Zorg dat alle numerieke kolommen als `Number` format staan (niet `Text`)
3. Verwijder incomplete responses (lege cellen in Van Westendorp vragen)
4. Verwijder outliers (bijv. €0.01 of €999.99)

---

## Tab 2: PER FLES (Voorbeeld Template)

### Data Preparation

**Kolom A-E: Sorted Price Points**

| A         | B             | C           | D             | E                 |
| --------- | ------------- | ----------- | ------------- | ----------------- |
| **Price** | **Too Cheap** | **Bargain** | **Expensive** | **Too Expensive** |
| €5.00     | 1             | 0           | 0             | 0                 |
| €6.00     | 1             | 0           | 0             | 0                 |
| €7.00     | 2             | 1           | 0             | 0                 |
| €8.00     | 3             | 5           | 0             | 0                 |
| €9.00     | 5             | 8           | 1             | 0                 |
| ...       | ...           | ...         | ...           | ...               |

**How to create this table:**

1. **Collect all unique price points** from Q4a-Q4d (Too Cheap, Bargain, Expensive, Too Expensive)
2. **Sort ascending** (lowest to highest price)
3. **Count frequency** of each price point per category

**Formula Examples:**

- Cell B2 (Too Cheap count for €5.00):

  ```excel
  =COUNTIF('RAW DATA'!$E:$E, A2)
  ```

  Where column E in RAW DATA contains all Q4a_PerBottle_TooCheap responses.

- Repeat for Bargain (C), Expensive (D), Too Expensive (E)

---

### Cumulative Frequencies

**Kolom F-I: Cumulative Percentages**

| F                     | G                       | H                         | I                         |
| --------------------- | ----------------------- | ------------------------- | ------------------------- |
| **Too Cheap (Cum %)** | **Not Bargain (Cum %)** | **Not Expensive (Cum %)** | **Too Expensive (Cum %)** |
| 2%                    | 100%                    | 2%                        | 0%                        |
| 4%                    | 100%                    | 4%                        | 0%                        |
| 6%                    | 98%                     | 6%                        | 0%                        |
| 10%                   | 90%                     | 8%                        | 2%                        |
| 15%                   | 75%                     | 12%                       | 4%                        |
| ...                   | ...                     | ...                       | ...                       |

**Formulas:**

- **F2 (Too Cheap cumulative %):**

  ```excel
  =SUM($B$2:B2) / COUNT('RAW DATA'!$E:$E)
  ```

  Cumulative sum of Too Cheap counts / total respondents.

- **G2 (Not Bargain cumulative %):**

  ```excel
  =1 - (SUM($C$2:C2) / COUNT('RAW DATA'!$F:$F))
  ```

  100% minus cumulative Bargain percentage.

- **H2 (Not Expensive cumulative %):**

  ```excel
  =SUM($D$2:D2) / COUNT('RAW DATA'!$G:$G)
  ```

  Cumulative sum of Expensive counts / total respondents.

- **I2 (Too Expensive cumulative %):**
  ```excel
  =SUM($E$2:E2) / COUNT('RAW DATA'!$H:$H)
  ```
  Cumulative sum of Too Expensive counts / total respondents.

**Copy formulas down** voor alle price points.

---

### Create Line Chart

**X-axis:** Price (Kolom A)
**Y-axis:** Cumulative % (0% - 100%)

**4 Lines:**

1. **Too Cheap** (Kolom F) - Ascending curve, starts low
2. **Not Bargain** (Kolom G) - Descending curve, starts at 100%
3. **Not Expensive** (Kolom H) - Ascending curve, starts low
4. **Too Expensive** (Kolom I) - Ascending curve, starts low

**Chart Setup:**

1. Select data range A1:I50 (adjust based on data)
2. Insert → Line Chart → Line with Markers
3. Format:
   - Title: "Van Westendorp Price Sensitivity - Per Fles"
   - X-axis: "Prijs (€)"
   - Y-axis: "Respondenten (%)"
   - Legend: Right side

**Colors (recommended):**

- Too Cheap: Blue (#4285F4)
- Not Bargain: Orange (#FF9800)
- Not Expensive: Green (#34A853)
- Too Expensive: Red (#EA4335)

---

### Identify Crosspoints

**Visual Inspection Method:**

Look for where lines intersect:

1. **Point of Marginal Cheapness (PMC)**: Too Cheap ∩ Not Expensive
   - "Below this, quality concerns arise"
   - Example: €7.50

2. **Point of Marginal Expensiveness (PME)**: Not Bargain ∩ Too Expensive
   - "Above this, too expensive for most"
   - Example: €18.00

3. **Optimal Price Point (OPP)**: Not Bargain ∩ Not Expensive
   - "Sweet spot, highest acceptance"
   - Example: €12.50

4. **Indifference Price Point (IPP)**: Too Cheap ∩ Too Expensive
   - "Equal concerns about quality vs price"
   - Example: €15.00

**Formula Method (Approximate Crosspoint):**

Use Excel's "FORECAST" or "LINEST" functions to find intersection coordinates, or use Goal Seek:

1. Create helper column with difference between two curves
2. Use Goal Seek to find where difference = 0

Example:

```excel
=ABS(F2 - H2)  // Difference between Too Cheap and Not Expensive
```

Then: Data → What-If Analysis → Goal Seek → Set cell to 0 by changing Price cell.

**Annotate Chart:**

- Add data labels for 4 crosspoints
- Add vertical lines (optional)

---

### Range of Acceptable Pricing (RAP)

**Definition:** PMC to PME

**Example:**

- PMC: €7.50
- PME: €18.00
- RAP: €7.50 - €18.00

**Optimal Launch Price:** OPP (€12.50 in example)

**Interpretation:**

- Below PMC (€7.50): Quality concerns
- PMC - OPP (€7.50 - €12.50): Budget-conscious segment
- OPP - PME (€12.50 - €18.00): Premium segment
- Above PME (€18.00): Too expensive

---

## Tab 3-5: MAANDELIJKS, KWARTAAL, BUNDEL

**Repeat same structure as Tab 2** for each pricing model:

- MAANDELIJKS: Use Q5a-Q5d columns from RAW DATA
- KWARTAAL: Use Q6a-Q6d columns from RAW DATA
- BUNDEL: Use Q7a-Q7d columns from RAW DATA

**Result:** 4 Van Westendorp charts, one per pricing model.

---

## Tab 6: SUMMARY

### Pricing Model Comparison

| Pricing Model               | PMC    | OPP     | IPP     | PME     | RAP              | Launch Price |
| --------------------------- | ------ | ------- | ------- | ------- | ---------------- | ------------ |
| **Per Fles**                | €7.50  | €12.50  | €15.00  | €18.00  | €7.50 - €18.00   | **€12.50**   |
| **Maandelijks (2 flessen)** | €22.00 | €35.00  | €42.00  | €55.00  | €22.00 - €55.00  | **€35.00**   |
| **Kwartaal (6 flessen)**    | €70.00 | €105.00 | €125.00 | €160.00 | €70.00 - €160.00 | **€105.00**  |
| **Bundel (variabel)**       | €30.00 | €50.00  | €65.00  | €85.00  | €30.00 - €85.00  | **€50.00**   |

**Conversion Analysis:**

| Model       | Price per Bottle          | Implied Monthly Spend | Target Segment             |
| ----------- | ------------------------- | --------------------- | -------------------------- |
| Per Fles    | €12.50                    | Varies (user chooses) | Flexibility seekers        |
| Maandelijks | €17.50/bottle             | €35.00/month          | Regular drinkers           |
| Kwartaal    | €17.50/bottle             | €35.00/month (€105/3) | Committed wine enthusiasts |
| Bundel      | €16.67/bottle (3 flessen) | One-time              | Gifters, occasionals       |

**Recommendation:**

- Start with **Maandelijks abonnement** at **€35/month** (2 flessen)
- Offer **Per Fles** at **€12.50** for flexibility
- Promote **Kwartaal** at **€105** for 15% savings vs monthly (€105 vs €105)
- Test **Bundels** seasonally (holidays, events)

---

## Tab 7: SEGMENTS

### Segmentation by Budget

**Filter RAW DATA by Q1_Monthly_Budget:**

| Segment              | Budget Range | N   | Per Fles OPP | Monthly OPP | Kwartaal OPP |
| -------------------- | ------------ | --- | ------------ | ----------- | ------------ |
| **Budget Conscious** | < €50        | 15  | €9.00        | €28.00      | €85.00       |
| **Mid-Range**        | €50 - €100   | 25  | €12.50       | €35.00      | €105.00      |
| **Premium**          | > €100       | 10  | €16.00       | €45.00      | €135.00      |

**Action:**

- Create separate Van Westendorp charts for each segment
- Use conditional formulas to filter RAW DATA by budget range
- Identify if pricing should differ per segment (tiered pricing)

### Segmentation by Purchase Frequency

| Segment        | Frequency                      | N   | Preferred Model | OPP     |
| -------------- | ------------------------------ | --- | --------------- | ------- |
| **Weekly**     | Meerdere keren/week, wekelijks | 18  | Maandelijks     | €35.00  |
| **Monthly**    | Maandelijks                    | 20  | Kwartaal        | €105.00 |
| **Occasional** | Paar keer/jaar                 | 12  | Bundel          | €50.00  |

**Insight:** Match pricing model recommendations to user purchase habits.

---

## Quality Checks

### Data Validation

- [ ] **Logical ordering**: Too Cheap < Bargain < Expensive < Too Expensive (per respondent)
- [ ] **Outlier removal**: Remove responses with €0.01, €999, or illogical sequences
- [ ] **Completeness**: Minimum 50 complete responses per pricing model
- [ ] **Curve shapes**: Too Cheap ascending, Not Bargain descending, visual crosspoints clear

### Common Issues

| Issue                    | Symptom                       | Fix                                       |
| ------------------------ | ----------------------------- | ----------------------------------------- |
| **No clear crosspoints** | Lines don't intersect cleanly | Increase sample size (aim for 100+)       |
| **PMC > PME**            | Inverted range                | Check data entry errors, remove outliers  |
| **Flat curves**          | No variation in responses     | Survey didn't reach right audience        |
| **Bimodal distribution** | Two peaks in responses        | Indicates 2+ segments, analyze separately |

---

## Export & Reporting

### Deliverables

1. **Excel file** met alle tabs (RAW DATA - SEGMENTS)
2. **4 Van Westendorp charts** (PNG/PDF export voor presentaties)
3. **SUMMARY tab** als decision-ready pricing recommendation
4. **Segment analysis** als basis voor tiered pricing strategy

### Presentation Slide Template

**Slide 1: Per Fles Pricing**

- Chart image
- Key findings:
  - RAP: €7.50 - €18.00
  - OPP: €12.50
  - Recommendation: Launch at €12.50

**Slide 2: Maandelijks Abonnement**

- Chart image
- Key findings:
  - RAP: €22.00 - €55.00
  - OPP: €35.00
  - Recommendation: Launch at €35.00 (2 flessen/maand)

**Slide 3: Kwartaal & Bundels**

- 2 charts side-by-side
- Comparative findings

**Slide 4: Segment Insights**

- Budget segments table
- Frequency segments table
- Tiered pricing recommendations

---

## Advanced: Automated Analysis with Formulas

### Dynamic Crosspoint Detection

**Formula to find OPP (Not Bargain ∩ Not Expensive):**

1. Create helper column with absolute difference:

   ```excel
   =ABS(G2 - H2)
   ```

2. Find minimum difference:

   ```excel
   =MIN(J:J)
   ```

3. Use INDEX-MATCH to get corresponding price:
   ```excel
   =INDEX(A:A, MATCH(MIN(J:J), J:J, 0))
   ```

**Repeat for other crosspoints** (PMC, PME, IPP).

---

## Template Download

**Pre-built Excel template** beschikbaar in:
`~/Development/products/vino12/templates/Van-Westendorp-Analysis-Template.xlsx`

**Features:**

- Pre-configured formulas for all 4 pricing models
- Automated chart generation
- Crosspoint detection helpers
- Segment analysis tabs
- Summary dashboard

**Usage:**

1. Download template
2. Paste RAW DATA from survey export
3. Verify formulas reference correct columns
4. Charts auto-update
5. Review SUMMARY tab for recommendations

---

_Template designed for: VINO12 Pricing Validation (VINO-138)_
_Version: 1.0_
_Created: 2026-02-08_
