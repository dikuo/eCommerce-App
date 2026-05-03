from pathlib import Path
root = Path(r'c:/projects/eCommerce-App/frontend/src')
for jsx in root.rglob('*.jsx'):
    tsx = jsx.with_suffix('.tsx')
    if tsx.exists():
        print('Removing duplicate:', jsx)
        jsx.unlink()
    else:
        print('Renaming:', jsx, '->', tsx)
        jsx.rename(tsx)
